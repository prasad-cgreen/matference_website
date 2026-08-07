import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUBJECTS } from "@/data/site";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const EMPTY = { first_name: "", last_name: "", email: "", subject: "", message: "" };

export default function ContactUs() {
  const [form, setForm] = useState(EMPTY);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  // Pre-select subject when arriving via a specific CTA (e.g. "Be a Pragati Kendra").
  useEffect(() => {
    const onSubject = (e) => {
      if (e.detail) setForm((f) => ({ ...f, subject: e.detail }));
    };
    window.addEventListener("cgreen:contact-subject", onSubject);
    return () => window.removeEventListener("cgreen:contact-subject", onSubject);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name.trim()) e.last_name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject) e.subject = "Please select a subject";
    if (!form.message.trim()) e.message = "Required";
    if (!terms) e.terms = "You must accept the Terms & Privacy Policy";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // FLAGGED — UNDECIDED: no CRM target provided in source material.
      // For now we persist the lead to the backend (MongoDB) as a stub.
      // TODO: wire submit action to the real CRM/endpoint once provided.
      const payload = { ...form, accepted_terms: terms };
      console.log("[cGreen] contact submission (stub → backend):", payload);
      await axios.post(`${API}/contact`, payload);
      toast.success("Thanks! Your message has been received. Our team will reach out shortly.");
      setForm(EMPTY);
      setTerms(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const errCls = "text-xs text-red-600 mt-1 font-body";

  return (
    <section id="contact" className="relative w-full py-24 scroll-mt-24" data-testid="section-contact">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-head text-4xl lg:text-5xl text-[#142984] mb-3 text-center">Contact Us</h2>
        <p className="font-body text-base lg:text-lg text-[#142984]/70 mb-10 text-center">
          Partner with us, start a Pragati Kendra, or book a product demo.
        </p>

        <form onSubmit={onSubmit} className="glass glass-yellow rounded-[28px] p-8 space-y-5" data-testid="contact-form" noValidate>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label className="text-[#142984] font-body">First Name</Label>
              <Input
                data-testid="contact-first-name"
                value={form.first_name}
                onChange={(e) => set("first_name", e.target.value)}
                className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]"
              />
              {errors.first_name && <p className={errCls}>{errors.first_name}</p>}
            </div>
            <div>
              <Label className="text-[#142984] font-body">Last Name</Label>
              <Input
                data-testid="contact-last-name"
                value={form.last_name}
                onChange={(e) => set("last_name", e.target.value)}
                className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]"
              />
              {errors.last_name && <p className={errCls}>{errors.last_name}</p>}
            </div>
          </div>

          <div>
            <Label className="text-[#142984] font-body">Email</Label>
            <Input
              type="email"
              data-testid="contact-email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]"
            />
            {errors.email && <p className={errCls}>{errors.email}</p>}
          </div>

          <div>
            <Label className="text-[#142984] font-body">Subject</Label>
            <Select value={form.subject} onValueChange={(v) => set("subject", v)}>
              <SelectTrigger data-testid="contact-subject" className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s} data-testid={`subject-option-${s.replace(/\s+/g, "-").toLowerCase()}`}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && <p className={errCls}>{errors.subject}</p>}
          </div>

          <div>
            <Label className="text-[#142984] font-body">Message</Label>
            <Textarea
              data-testid="contact-message"
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              rows={4}
              className="mt-1.5 bg-white/70 border-[#142984]/20 text-[#142984]"
            />
            {errors.message && <p className={errCls}>{errors.message}</p>}
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              data-testid="contact-terms"
              checked={terms}
              onCheckedChange={(v) => { setTerms(!!v); setErrors((e) => ({ ...e, terms: undefined })); }}
              className="mt-1 border-[#142984]/40 data-[state=checked]:bg-[#142984]"
            />
            <div>
              <Label htmlFor="terms" className="text-[#142984] font-body text-sm cursor-pointer">
                I accept the Terms &amp; Conditions and Privacy Policy.
              </Label>
              {errors.terms && <p className={errCls}>{errors.terms}</p>}
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
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
