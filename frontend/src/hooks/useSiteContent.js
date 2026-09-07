/**
 * Website content edited in the admin panel.
 *
 * Every section calls one of these hooks and passes the values bundled in
 * `@/data/site` as a fallback. Until the request finishes - and forever, if the
 * backend is unreachable - the page renders exactly what it renders today, so
 * a database outage can never blank the marketing site.
 *
 * An empty list from a *successful* response is honoured rather than replaced
 * by the fallback: that is an administrator who deliberately emptied a section,
 * not a failure.
 */
import { useEffect, useState } from "react";
import axios from "axios";

const CONTENT_URL = `${process.env.REACT_APP_BACKEND_URL || ""}/api/content`;

// One request serves every section on the page, shared through this promise.
let pending = null;

export function useSiteContent() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let alive = true;
    if (!pending) {
      pending = axios
        .get(CONTENT_URL)
        .then((response) => response.data)
        // Swallowed on purpose: the caller's fallback is the answer.
        .catch(() => null);
    }
    pending.then((data) => {
      if (alive) setContent(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  return content;
}

/** A single block of copy, e.g. `vision_mission`. */
export function useSection(key, fallback) {
  const content = useSiteContent();
  return content?.singletons?.[key] ?? fallback;
}

const toPerson = (item) => ({
  name: item.name,
  title: item.title,
  bio: item.bio,
  linkedin: item.link,
  photo: item.image_url,
});

const toLogo = (item) => ({ alt: item.name, src: item.image_url });

export function usePeople(group, fallback) {
  const content = useSiteContent();
  if (!content) return fallback;
  return (content.groups?.[group] || []).map(toPerson);
}

export function useLogos(group, fallback) {
  const content = useSiteContent();
  if (!content) return fallback;
  return (content.groups?.[group] || []).map(toLogo);
}
