import axios from "axios";

// Same-origin in production; a build-time URL when the API is hosted separately.
const API = `${process.env.REACT_APP_BACKEND_URL || ""}/api`;

const TOKEN_KEY = "cgreen.admin.token";

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      // Private browsing and blocked site data both throw here.
      return null;
    }
  },
  set: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* session lasts only as long as the tab */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* nothing to clear */
    }
  },
};

export const admin = axios.create({ baseURL: API });

admin.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A 401 anywhere means the session is gone; drop the token so the route guard
// redirects to the login screen instead of leaving a dead dashboard on screen.
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

admin.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      tokenStore.clear();
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);

/** Human-readable message from a FastAPI error, whatever shape it arrives in. */
export function errorMessage(error, fallback = "Something went wrong. Please try again.") {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  if (error?.code === "ERR_NETWORK") return "Cannot reach the server. Is the backend running?";
  return fallback;
}

export const api = {
  login: (email, password) =>
    axios.post(`${API}/admin/login`, { email, password }).then((r) => r.data),
  me: () => admin.get("/admin/me").then((r) => r.data),

  listAlbums: () => admin.get("/admin/gallery/albums").then((r) => r.data),
  createAlbum: (payload) => admin.post("/admin/gallery/albums", payload).then((r) => r.data),
  updateAlbum: (id, payload) =>
    admin.patch(`/admin/gallery/albums/${id}`, payload).then((r) => r.data),
  deleteAlbum: (id) => admin.delete(`/admin/gallery/albums/${id}`),

  uploadPhotos: (albumId, files, onProgress) => {
    const form = new FormData();
    Array.from(files).forEach((file) => form.append("files", file));
    return admin
      .post(`/admin/gallery/albums/${albumId}/photos`, form, {
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
        },
      })
      .then((r) => r.data);
  },
  updatePhoto: (id, payload) =>
    admin.patch(`/admin/gallery/photos/${id}`, payload).then((r) => r.data),
  deletePhoto: (id) => admin.delete(`/admin/gallery/photos/${id}`),

  listEnquiries: ({ q = "", limit = 25, offset = 0 } = {}) =>
    admin
      .get("/admin/enquiries", { params: { q, limit, offset } })
      .then((r) => r.data),
  markEnquiryRead: (id, isRead) =>
    admin.patch(`/admin/enquiries/${id}`, { is_read: isRead }).then((r) => r.data),
  deleteEnquiry: (id) => admin.delete(`/admin/enquiries/${id}`),

  system: () => admin.get("/admin/system").then((r) => r.data),

  content: () => admin.get("/admin/content").then((r) => r.data),
  saveSection: (key, value) =>
    admin.put(`/admin/content/singletons/${key}`, value).then((r) => r.data),

  listItems: (group) => admin.get(`/admin/content/groups/${group}`).then((r) => r.data),
  createItem: (group, payload) =>
    admin.post(`/admin/content/groups/${group}`, payload).then((r) => r.data),
  updateItem: (id, payload) =>
    admin.patch(`/admin/content/items/${id}`, payload).then((r) => r.data),
  deleteItem: (id) => admin.delete(`/admin/content/items/${id}`),
  reorderItems: (group, ids) =>
    admin.post(`/admin/content/groups/${group}/reorder`, { ids }).then((r) => r.data),
  uploadImage: (file) => {
    const form = new FormData();
    form.append("file", file);
    return admin.post("/admin/content/uploads", form).then((r) => r.data);
  },
  uploadItemImage: (id, file, onProgress) => {
    const form = new FormData();
    form.append("file", file);
    return admin
      .post(`/admin/content/items/${id}/image`, form, {
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
        },
      })
      .then((r) => r.data);
  },
};
