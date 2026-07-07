import React from "react";
import { Linkedin, Instagram, Youtube, Mail, Globe, Phone } from "lucide-react";
import { FOOTER } from "@/data/site";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#142984] text-[#FFFCFA] pt-16 pb-8" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        {/* Brand + tagline */}
        <div className="md:col-span-2">
          <img src="/cgreen-logo-white.png" alt="cGreen" className="h-9 w-auto mb-4" />
          <p className="font-body text-sm text-[#FFFCFA]/80 max-w-sm">{FOOTER.tagline}</p>
          <div className="flex gap-3 mt-6">
            {[Linkedin, Instagram, Youtube].map((Icon, i) => (
              <span
                key={i}
                className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center hover:bg-[#FCDD15] hover:text-[#142984] transition-colors cursor-pointer"
                data-testid={`footer-social-${i}`}
              >
                <Icon size={18} />
              </span>
            ))}
          </div>
        </div>

        {/* Company links */}
        <div>
          <h4 className="font-head text-[#FCDD15] mb-4">Company</h4>
          <ul className="space-y-2">
            {FOOTER.companyLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="font-body text-sm text-[#FFFCFA]/80 hover:text-[#FCDD15] transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-head text-[#FCDD15] mb-4">Reach Us</h4>
          <ul className="space-y-3 font-body text-sm text-[#FFFCFA]/80">
            <li className="flex items-center gap-2"><Mail size={15} /> {FOOTER.email}</li>
            <li className="flex items-center gap-2"><Globe size={15} /> {FOOTER.website}</li>
            <li className="flex items-center gap-2"><Phone size={15} /> {FOOTER.phone}</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid md:grid-cols-2 gap-6">
        <p className="font-body text-xs text-[#FFFCFA]/60">{FOOTER.commAddress}</p>
        <p className="font-body text-xs text-[#FFFCFA]/60">{FOOTER.regAddress}</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-white/15 flex flex-col md:flex-row justify-between gap-3">
        <p className="font-body text-xs text-[#FFFCFA]/60">
          CIN: {FOOTER.cin} &nbsp;•&nbsp; GST: {FOOTER.gst}
        </p>
        <p className="font-body text-xs text-[#FFFCFA]/60">
          © {new Date().getFullYear()} cGreen. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
