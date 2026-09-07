import React, { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV } from "@/data/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToId = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNav = (item) => {
    setMobileOpen(false);
    if (item.to) {
      navigate(item.to);
      window.scrollTo({ top: 0 });
      return;
    }
    if (item.tab) {
      window.dispatchEvent(new CustomEvent("cgreen:services-tab", { detail: item.tab }));
    }
    if (item.href && item.href.startsWith("#") && item.href.length > 1) {
      scrollToId(item.href.slice(1));
    }
  };

  const goContactWithSubject = (subject) => {
    setMobileOpen(false);
    const fire = () =>
      window.dispatchEvent(new CustomEvent("cgreen:contact-subject", { detail: subject }));
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        fire();
        const el = document.getElementById("contact");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } else {
      fire();
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goPragatiKendra = () => goContactWithSubject("Start a Pragati Kendra");
  const goBookDemo = () => goContactWithSubject("Request Product Demo");

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl" data-testid="navbar">
      <nav className="relative rounded-full px-4 py-2.5">
        {/* Glass/shine layer — isolated so its overflow:hidden doesn't clip the dropdowns */}
        <span
          aria-hidden="true"
          className={`glass glass-nav ${scrolled ? "glass-nav-scrolled" : ""} inset-0 rounded-full transition-[background] duration-500`}
          style={{ position: "absolute", zIndex: 0 }}
        />
        <div className="relative z-10 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToId("hero")}
            className="flex items-center shrink-0 pl-1"
            data-testid="nav-logo"
          >
            <img src="/cgreen-logo-transparent.png" alt="cGreen" className="h-10 w-auto md:h-12" />
          </button>

          {/* Center nav (desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  onClick={() => !item.dropdown && handleNav(item)}
                  data-testid={`nav-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
                  className="flex items-center gap-1 px-3 py-2 rounded-full text-[15px] font-body font-medium text-[#142984] hover:text-[#0d1b5c] hover:bg-white/25 transition-colors"
                >
                  {item.label}
                  {item.dropdown && <ChevronDown size={14} className="text-[#142984]" />}
                </button>

                {item.dropdown && openMenu === item.label && (
                  <div className="absolute left-0 top-full pt-2 z-[60]">
                    <div className="glass glass-nav rounded-2xl p-2 min-w-[210px] shadow-xl">
                      {item.dropdown.map((d) => (
                        <button
                          key={d.label}
                          onClick={() => handleNav(d)}
                          data-testid={`nav-drop-${d.label.replace(/\s+/g, "-").toLowerCase()}`}
                          className="block w-full text-left px-3 py-2 rounded-xl text-sm font-body text-[#142984] hover:bg-[#142984]/10 transition-colors"
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="https://newapp.cgreen.in/login"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="nav-login"
              className="px-5 py-2 rounded-full border border-[#142984] text-[#142984] text-sm font-body font-medium hover:bg-[#142984] hover:text-[#FFFCFA] transition-colors"
            >
              Login
            </a>
            <button
              onClick={goPragatiKendra}
              data-testid="nav-be-pragati-kendra"
              className="px-5 py-2 rounded-full bg-[#142984] text-[#FFFCFA] text-sm font-head font-bold hover:bg-[#FCDD15] hover:text-[#142984] transition-colors"
            >
              Be a Pragati Kendra
            </button>
            <button
              onClick={goBookDemo}
              data-testid="nav-book-demo"
              className="px-5 py-2 rounded-full bg-[#142984] text-[#FFFCFA] text-sm font-head font-bold hover:bg-[#FCDD15] hover:text-[#142984] transition-colors"
            >
              Partner with Us
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-[#142984]"
            onClick={() => setMobileOpen((v) => !v)}
            data-testid="nav-mobile-toggle"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 glass glass-nav glass-nav-scrolled rounded-2xl p-3" data-testid="nav-mobile-menu">
          {NAV.map((item) => (
            <div key={item.label} className="py-1">
              <button
                onClick={() => handleNav(item)}
                className="block w-full text-left px-3 py-2 rounded-xl text-[#142984] font-body font-medium"
              >
                {item.label}
              </button>
              {item.dropdown && (
                <div className="pl-4">
                  {item.dropdown.map((d) => (
                    <button
                      key={d.label}
                      onClick={() => handleNav(d)}
                      className="block w-full text-left px-3 py-1.5 text-sm text-[#142984]/80 font-body"
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="flex gap-2 mt-2 px-3">
            <a
              href="https://newapp.cgreen.in/login"
              className="flex-1 text-center px-4 py-2 rounded-full border border-[#142984] text-[#142984] text-sm font-medium"
            >
              Login
            </a>
            <button
              onClick={goBookDemo}
              className="flex-1 px-4 py-2 rounded-full bg-[#142984] text-[#FFFCFA] text-sm font-head font-bold"
            >
              Partner with Us
            </button>
          </div>
          <button
            onClick={goPragatiKendra}
            className="w-full mt-2 px-4 py-2 rounded-full bg-[#142984] text-[#FFFCFA] text-sm font-head font-bold hover:bg-[#FCDD15] hover:text-[#142984] transition-colors"
            data-testid="nav-be-pragati-kendra-mobile"
          >
            Be a Pragati Kendra
          </button>
        </div>
      )}
    </div>
  );
}
