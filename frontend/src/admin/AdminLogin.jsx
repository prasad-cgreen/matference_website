import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/admin/AuthContext";
import { errorMessage } from "@/admin/api";
import { UNZOOM } from "@/admin/ui";

export default function AdminLogin() {
  const { signIn, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Someone who is already signed in has no business on the login screen.
  useEffect(() => {
    if (status === "signed-in") navigate(destination, { replace: true });
  }, [status, destination, navigate]);

  const validate = () => {
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address";
    if (!password) next.password = "Enter your password";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate(destination, { replace: true });
    } catch (error) {
      setFormError(errorMessage(error, "Could not sign you in. Please try again."));
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  };

  const errCls = "text-xs text-red-600 mt-1 font-body";
  const fieldCls =
    "mt-1.5 h-11 rounded-xl bg-white/80 border-[#142984]/15 text-[#142984] focus-visible:ring-[#142984]/30";

  return (
    <div
      className="min-h-screen w-full bg-[#FFFCFA] flex items-center justify-center px-5 py-14"
      style={UNZOOM}
    >
      {/* Soft brand wash, echoing the landing page's atmosphere. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-[#FCDD15]/25 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#142984]/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/cgreen-logo-transparent.png"
            alt="CGreen"
            className="h-11 mx-auto mb-6"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <h1 className="font-head text-3xl lg:text-4xl text-[#142984]">Admin Sign In</h1>
          <p className="font-body text-sm text-[#142984]/60 mt-2">
            Photos, enquiries and settings for the CGreen website.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="glass glass-yellow rounded-[28px] p-8 space-y-5"
          data-testid="admin-login-form"
          noValidate
        >
          {formError && (
            <div
              role="alert"
              data-testid="admin-login-error"
              className="flex items-start gap-2.5 rounded-2xl border border-red-300/70 bg-red-50/80 px-4 py-3"
            >
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <p className="font-body text-sm text-red-700">{formError}</p>
            </div>
          )}

          <div>
            <Label htmlFor="admin-email" className="text-[#142984] font-body">
              Email
            </Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              autoFocus
              data-testid="admin-email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => ({ ...p, email: undefined }));
              }}
              className={fieldCls}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className={errCls}>{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="admin-password" className="text-[#142984] font-body">
              Password
            </Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                data-testid="admin-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((p) => ({ ...p, password: undefined }));
                }}
                className={`${fieldCls} pr-11`}
                aria-invalid={Boolean(errors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                data-testid="admin-toggle-password"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#142984]/50 hover:text-[#142984] transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className={errCls}>{errors.password}</p>}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            data-testid="admin-submit"
            className="w-full bg-[#142984] text-[#FFFCFA] font-head font-bold rounded-full py-6 text-base hover:bg-[#FCDD15] hover:text-[#142984] transition-colors disabled:opacity-70"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 font-body text-xs text-[#142984]/50 pt-1">
            <Lock className="h-3 w-3" />
            Authorised personnel only
          </p>
        </form>

        <p className="text-center font-body text-xs text-[#142984]/40 mt-6">
          <a href="/" className="hover:text-[#142984] transition-colors">
            ← Back to cgreen.in
          </a>
        </p>
      </div>
    </div>
  );
}
