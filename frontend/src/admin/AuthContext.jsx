import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api, setUnauthorizedHandler, tokenStore } from "@/admin/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [email, setEmail] = useState(null);
  // "checking" until a stored token has been validated against the server, so
  // the guard never flashes the login page at an already-signed-in admin.
  const [status, setStatus] = useState("checking");

  const signOut = useCallback(() => {
    tokenStore.clear();
    setEmail(null);
    setStatus("signed-out");
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setEmail(null);
      setStatus("signed-out");
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!tokenStore.get()) {
      setStatus("signed-out");
      return undefined;
    }
    // A token in storage proves nothing: it may be expired, or signed with a
    // secret this server no longer uses. Ask the server.
    api
      .me()
      .then((data) => {
        if (cancelled) return;
        setEmail(data.email);
        setStatus("signed-in");
      })
      .catch(() => {
        if (cancelled) return;
        tokenStore.clear();
        setStatus("signed-out");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (address, password) => {
    const session = await api.login(address, password);
    tokenStore.set(session.access_token);
    setEmail(session.email);
    setStatus("signed-in");
    return session;
  }, []);

  const value = useMemo(
    () => ({ email, status, signIn, signOut, isAuthenticated: status === "signed-in" }),
    [email, status, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

/** Blocks a route until the session is confirmed. */
export function RequireAdmin({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "checking") {
    return (
      <div className="min-h-screen grid place-items-center bg-[#FFFCFA]" data-testid="admin-auth-checking">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#142984]/20 border-t-[#142984] animate-spin" />
          <p className="font-body text-sm text-[#142984]/60">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (status !== "signed-in") {
    // Remember where they were headed so login can return them there.
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
