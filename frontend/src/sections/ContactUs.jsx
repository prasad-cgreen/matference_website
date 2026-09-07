  // import React, { useState, useEffect } from "react";
  // import axios from "axios";
  // import { toast } from "sonner";
  // import { Input } from "@/components/ui/input";
  // import { Textarea } from "@/components/ui/textarea";
  // import { Label } from "@/components/ui/label";
  // import { Checkbox } from "@/components/ui/checkbox";
  // import { Button } from "@/components/ui/button";
  // import {
  //   Select,
  //   SelectContent,
  //   SelectItem,
  //   SelectTrigger,
  //   SelectValue,
  // } from "@/components/ui/select";
  // import { SUBJECTS } from "@/data/site";

  // // Production serves the frontend and API from one origin. A build-time URL is
  // // still supported for deployments that host the API separately.
  // const API = `${process.env.REACT_APP_BACKEND_URL || ""}/api`;

  // const EMPTY = { first_name: "", last_name: "", email: "", subject: "", message: "" };

  // export default function ContactUs() {
  //   const [form, setForm] = useState(EMPTY);
  //   const [terms, setTerms] = useState(false);
  //   const [errors, setErrors] = useState({});
  //   const [submitting, setSubmitting] = useState(false);

  //   const set = (k, v) => {
  //     setForm((f) => ({ ...f, [k]: v }));
  //     setErrors((e) => ({ ...e, [k]: undefined }));
  //   };

  //   // Pre-select subject when arriving via a specific CTA (e.g. "Be a Pragati Kendra").
  //   useEffect(() => {
  //     const onSubject = (e) => {
  //       if (e.detail) setForm((f) => ({ ...f, subject: e.detail }));
  //     };
  //     window.addEventListener("cgreen:contact-subject", onSubject);
  //     return () => window.removeEventListener("cgreen:contact-subject", onSubject);
  //   }, []);

  //   const validate = () => {
  //     const e = {};
  //     if (!form.first_name.trim()) e.first_name = "Required";
  //     if (!form.last_name.trim()) e.last_name = "Required";
  //     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
  //     if (!form.subject) e.subject = "Please select a subject";
  //     if (!form.message.trim()) e.message = "Required";
  //     if (!terms) e.terms = "You must accept the Terms & Privacy Policy";
  //     setErrors(e);
  //     return Object.keys(e).length === 0;
  //   };

  //   const onSubmit = async (ev) => {
  //     ev.preventDefault();
  //     if (!validate()) return;
  //     setSubmitting(true);
  //     try {
  //       const payload = { ...form, accepted_terms: terms };
  //       await axios.post(`${API}/contact`, payload);
  //       toast.success("Thanks! Your message has been received. Our team will reach out shortly.");
  //       setForm(EMPTY);
  //       setTerms(false);
  //     } catch (err) {
  //       if (process.env.NODE_ENV === "development") console.error(err);
  //       const message = err.response?.data?.detail;
  //       toast.error(typeof message === "string" ? message : "Something went wrong. Please try again.");
  //     } finally {
  //       setSubmitting(false);
  //     }
  //   };

  //   const errCls = "text-xs text-red-600 mt-1 font-body";

  //   return (
  //     <section id="contact" className="relative w-full py-24 scroll-mt-24" data-testid="section-contact">
  //       <div className="max-w-3xl mx-auto px-6">
  //         <h2 className="font-head text-4xl lg:text-5xl text-[#142984] mb-3 text-center">Contact Us</h2>
  //         <p className="font-body text-base lg:text-lg text-[#142984]/70 mb-10 text-center">
  //           Partner with us, start a Pragati Kendra, or book a product demo.
  //         </p>

  //         <form onSubmit={onSubmit} className="glass glass-yellow rounded-[28px] p-8 space-y-5" data-testid="contact-form" noValidate>
  //           <div className="grid sm:grid-cols-2 gap-5">
  //             <div>
  //               <Label className="text-[#142984] font-body">First Name</Label>
  //               <Input
  //                 data-testid="contact-first-name"
  //                 value={form.first_name}
  //                 onChange={(e) => set("first_name", e.target.value)}
  //                 className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]"
  //               />
  //               {errors.first_name && <p className={errCls}>{errors.first_name}</p>}
  //             </div>
  //             <div>
  //               <Label className="text-[#142984] font-body">Last Name</Label>
  //               <Input
  //                 data-testid="contact-last-name"
  //                 value={form.last_name}
  //                 onChange={(e) => set("last_name", e.target.value)}
  //                 className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]"
  //               />
  //               {errors.last_name && <p className={errCls}>{errors.last_name}</p>}
  //             </div>
  //           </div>

  //           <div>
  //             <Label className="text-[#142984] font-body">Email</Label>
  //             <Input
  //               type="email"
  //               data-testid="contact-email"
  //               value={form.email}
  //               onChange={(e) => set("email", e.target.value)}
  //               className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]"
  //             />
  //             {errors.email && <p className={errCls}>{errors.email}</p>}
  //           </div>

  //           <div>
  //             <Label className="text-[#142984] font-body">Subject</Label>
  //             <Select value={form.subject} onValueChange={(v) => set("subject", v)}>
  //               <SelectTrigger data-testid="contact-subject" className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]">
  //                 <SelectValue placeholder="Select a subject" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 {SUBJECTS.map((s) => (
  //                   <SelectItem key={s} value={s} data-testid={`subject-option-${s.replace(/\s+/g, "-").toLowerCase()}`}>
  //                     {s}
  //                   </SelectItem>
  //                 ))}
  //               </SelectContent>
  //             </Select>
  //             {errors.subject && <p className={errCls}>{errors.subject}</p>}
  //           </div>

  //           <div>
  //             <Label className="text-[#142984] font-body">Message</Label>
  //             <Textarea
  //               data-testid="contact-message"
  //               value={form.message}
  //               onChange={(e) => set("message", e.target.value)}
  //               rows={4}
  //               className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]"
  //             />
  //             {errors.message && <p className={errCls}>{errors.message}</p>}
  //           </div>

  //           <div className="flex items-start gap-3">
  //             <Checkbox
  //               id="terms"
  //               data-testid="contact-terms"
  //               checked={terms}
  //               onCheckedChange={(v) => { setTerms(!!v); setErrors((e) => ({ ...e, terms: undefined })); }}
  //               className="mt-1 border-[#142984]/40 data-[state=checked]:bg-[#142984]"
  //             />
  //             <div>
  //               <Label htmlFor="terms" className="text-[#142984] font-body text-sm cursor-pointer">
  //                 I accept the Terms &amp; Conditions and Privacy Policy.
  //               </Label>
  //               {errors.terms && <p className={errCls}>{errors.terms}</p>}
  //             </div>
  //           </div>

  //           <Button
  //             type="submit"
  //             disabled={submitting}
  //             data-testid="contact-submit"
  //             className="w-full bg-[#142984] text-[#FFFCFA] font-head font-bold rounded-full py-6 text-base hover:bg-[#FCDD15] hover:text-[#142984] transition-colors"
  //           >
  //             {submitting ? "Sending..." : "Submit"}
  //           </Button>
  //         </form>
  //       </div>
  //     </section>
  //   );
  // }


  import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Turnstile } from "@marsidev/react-turnstile";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SUBJECTS } from "@/data/site";

// Production serves the frontend and API from one origin.
// A build-time URL is still supported for deployments that host
// the API separately.
const API = `${process.env.REACT_APP_BACKEND_URL || ""}/api`;

const EMPTY = {
  first_name: "",
  last_name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactUs() {
  const [form, setForm] = useState(EMPTY);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const turnstileRef = useRef(null);

  const set = (key, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [key]: undefined,
    }));
  };

  // Pre-select subject when arriving via a specific CTA
  // (e.g. "Be a Pragati Kendra").
  useEffect(() => {
    const onSubject = (event) => {
      if (event.detail) {
        setForm((currentForm) => ({
          ...currentForm,
          subject: event.detail,
        }));
      }
    };

    window.addEventListener("cgreen:contact-subject", onSubject);

    return () => {
      window.removeEventListener("cgreen:contact-subject", onSubject);
    };
  }, []);

  const validate = () => {
    const validationErrors = {};

    if (!form.first_name.trim()) {
      validationErrors.first_name = "Required";
    }

    if (!form.last_name.trim()) {
      validationErrors.last_name = "Required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      validationErrors.email = "Enter a valid email";
    }

    if (!form.subject) {
      validationErrors.subject = "Please select a subject";
    }

    if (!form.message.trim()) {
      validationErrors.message = "Required";
    }

    if (!terms) {
      validationErrors.terms =
        "You must accept the Terms & Privacy Policy";
    }

    if (!captchaToken) {
      validationErrors.captcha = "Please complete the CAPTCHA";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...form,
        accepted_terms: terms,
        captcha_token: captchaToken,
      };

      await axios.post(`${API}/contact`, payload);

      toast.success(
        "Thanks! Your message has been received. Our team will reach out shortly."
      );

      // Reset form
      setForm(EMPTY);
      setTerms(false);
      setCaptchaToken("");
      setErrors({});

      // Reset Turnstile widget
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Contact form submission error:", err);
      }

      const message = err.response?.data?.detail;

      toast.error(
        typeof message === "string"
          ? message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const errCls = "text-xs text-red-600 mt-1 font-body";

  return (
    <section
      id="contact"
      className="relative w-full py-24 scroll-mt-24"
      data-testid="section-contact"
    >
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-head text-4xl lg:text-5xl text-[#142984] mb-3 text-center">
          Contact Us
        </h2>

        <p className="font-body text-base lg:text-lg text-[#142984]/70 mb-10 text-center">
          Partner with us, start a Pragati Kendra, or book a product demo.
        </p>

        <form
          onSubmit={onSubmit}
          className="glass glass-yellow rounded-[28px] p-8 space-y-5"
          data-testid="contact-form"
          noValidate
        >
          {/* First Name / Last Name */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label className="text-[#142984] font-body">
                First Name
              </Label>

              <Input
                data-testid="contact-first-name"
                value={form.first_name}
                onChange={(event) =>
                  set("first_name", event.target.value)
                }
                className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]"
              />

              {errors.first_name && (
                <p className={errCls}>{errors.first_name}</p>
              )}
            </div>

            <div>
              <Label className="text-[#142984] font-body">
                Last Name
              </Label>

              <Input
                data-testid="contact-last-name"
                value={form.last_name}
                onChange={(event) =>
                  set("last_name", event.target.value)
                }
                className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]"
              />

              {errors.last_name && (
                <p className={errCls}>{errors.last_name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label className="text-[#142984] font-body">
              Email
            </Label>

            <Input
              type="email"
              data-testid="contact-email"
              value={form.email}
              onChange={(event) =>
                set("email", event.target.value)
              }
              className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]"
            />

            {errors.email && (
              <p className={errCls}>{errors.email}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <Label className="text-[#142984] font-body">
              Subject
            </Label>

            <Select
              value={form.subject}
              onValueChange={(value) => set("subject", value)}
            >
              <SelectTrigger
                data-testid="contact-subject"
                className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]"
              >
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>

              <SelectContent>
                {SUBJECTS.map((subject) => (
                  <SelectItem
                    key={subject}
                    value={subject}
                    data-testid={`subject-option-${subject
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                  >
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.subject && (
              <p className={errCls}>{errors.subject}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <Label className="text-[#142984] font-body">
              Message
            </Label>

            <Textarea
              data-testid="contact-message"
              value={form.message}
              onChange={(event) =>
                set("message", event.target.value)
              }
              rows={4}
              className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]"
            />

            {errors.message && (
              <p className={errCls}>{errors.message}</p>
            )}
          </div>

          {/* Terms & Privacy */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              data-testid="contact-terms"
              checked={terms}
              onCheckedChange={(value) => {
                setTerms(!!value);

                setErrors((currentErrors) => ({
                  ...currentErrors,
                  terms: undefined,
                }));
              }}
              className="mt-1 border-[#142984]/40 data-[state=checked]:bg-[#142984]"
            />

            <div>
              <Label
                htmlFor="terms"
                className="text-[#142984] font-body text-sm cursor-pointer"
              >
                I accept the Terms &amp; Conditions and Privacy Policy.
              </Label>

              {errors.terms && (
                <p className={errCls}>{errors.terms}</p>
              )}
            </div>
          </div>

          {/* CAPTCHA */}
          <div>
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.REACT_APP_TURNSTILE_SITE_KEY}
              onSuccess={(token) => {
                setCaptchaToken(token);

                setErrors((currentErrors) => ({
                  ...currentErrors,
                  captcha: undefined,
                }));
              }}
              onExpire={() => {
                setCaptchaToken("");

                setErrors((currentErrors) => ({
                  ...currentErrors,
                  captcha:
                    "CAPTCHA expired. Please verify again.",
                }));
              }}
              onError={() => {
                setCaptchaToken("");

                setErrors((currentErrors) => ({
                  ...currentErrors,
                  captcha:
                    "CAPTCHA verification failed. Please try again.",
                }));
              }}
            />

            {errors.captcha && (
              <p className={errCls}>{errors.captcha}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting || !captchaToken}
            data-testid="contact-submit"
            className="w-full bg-[#142984] text-[#FFFCFA] font-head font-bold rounded-full py-6 text-base hover:bg-[#FCDD15] hover:text-[#142984] transition-colors"
          >
            {submitting ? "Sending..." : "Submit"}
          </Button>
        </form>
      </div>
    </section>
  );
}
