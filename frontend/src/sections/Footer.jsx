import React from "react";
import { Linkedin, Instagram, Youtube } from "lucide-react";
import { FOOTER } from "@/data/site";

const SOCIALS = [
  { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/cgreenindia/" },
  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/cgreendebt?igsh=MWIyeWowdWVvYmdmdw%3D%3D" },
  { Icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@cGreen23" },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#142984] text-[#FFFCFA] pt-16 pb-8" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
        {/* Brand + description */}
        <div className="md:col-span-3" data-testid="footer-brand">
          <img src="/cgreen-logo-transparent.png" alt="cGreen" className="h-11 w-auto mb-5 brightness-0 invert" />
          <p className="font-body text-sm text-[#FFFCFA]/75 leading-relaxed max-w-xs">
            {FOOTER.description}
          </p>
        </div>

        {/* Company */}
        <div className="md:col-span-2" data-testid="footer-company">
          <h4 className="font-head text-base text-[#FCDD15] mb-4">Company</h4>
          <ul className="space-y-2.5">
            {FOOTER.companyLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  data-testid={`footer-link-${l.label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
                  className="font-body text-sm text-[#FFFCFA]/80 hover:text-[#FCDD15] transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Address */}
        <div className="md:col-span-4" data-testid="footer-address">
          <h4 className="font-head text-base text-[#FCDD15] mb-4">Address</h4>
          <p className="font-body text-sm leading-relaxed">
            <span className="font-semibold text-[#FFFCFA]">{FOOTER.commAddressLabel}</span>
            <span className="block text-[#FFFCFA]/75 mt-0.5">{FOOTER.commAddress}</span>
          </p>
          <p className="font-body text-sm leading-relaxed mt-4">
            <span className="font-semibold text-[#FFFCFA]">{FOOTER.regAddressLabel}</span>
            <span className="block text-[#FFFCFA]/75 mt-0.5">{FOOTER.regAddress}</span>
          </p>
        </div>

        {/* Socials */}
        <div className="md:col-span-3" data-testid="footer-socials">
          <h4 className="font-head text-base text-[#FCDD15] mb-4">Socials</h4>
          <div className="flex gap-3 mb-5">
            {SOCIALS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                data-testid={`footer-social-${label.toLowerCase()}`}
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[#FFFCFA] hover:bg-[#FCDD15] hover:text-[#142984] hover:border-[#FCDD15] transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          <ul className="space-y-2 font-body text-sm text-[#FFFCFA]/80">
            <li>
              <span className="font-semibold text-[#FFFCFA]">EMAIL:</span>{" "}
              <a href={`mailto:${FOOTER.email}`} className="hover:text-[#FCDD15] transition-colors" data-testid="footer-email">{FOOTER.email}</a>
            </li>
            <li><span className="font-semibold text-[#FFFCFA]">Website:</span> {FOOTER.website}</li>
            <li><span className="font-semibold text-[#FFFCFA]">CIN:</span> {FOOTER.cin}</li>
            <li><span className="font-semibold text-[#FFFCFA]">GST:</span> {FOOTER.gst}</li>
            <li>
              <span className="font-semibold text-[#FFFCFA]">Contact:</span>{" "}
              <a href={`tel:${FOOTER.phone.replace(/\s+/g, "")}`} className="hover:text-[#FCDD15] transition-colors" data-testid="footer-phone">{FOOTER.phone}</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-14 pt-6 border-t border-white/15">
        <p className="font-body text-xs text-[#FFFCFA]/60 text-center" data-testid="footer-copyright">
          Copyright © {new Date().getFullYear()} {FOOTER.legalName}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
