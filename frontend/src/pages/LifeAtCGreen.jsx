import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/sections/Footer";

// Placeholder images (swapped for real photos later). Counts vary per category.
const PICNIC = Array.from({ length: 11 }, (_, i) => `/life/picnic/picnic-${i + 1}.jpeg`);

const DURATION = 7; // seconds — pulse travels the full spine once per loop

const YEAR_BLOCK = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.25 }, transition: { duration: 0.6, ease: "easeOut" } };
const BOX_REVEAL = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 } };

const TIMELINE = [
  {
    year: "2026",
    type: "cat",
    cats: [
      { key: "picnic", label: "Picnic", images: PICNIC, cover: PICNIC[1] },
      { key: "team", label: "Team Photos", images: [] },
    ],
  },
  { year: "2025", type: "pool", label: "Highlights", images: [] },
  { year: "2024", type: "pool", label: "Highlights", images: [] },
  { year: "2023", type: "pool", label: "Highlights", images: [] },
];

function GalleryBox({ label, images, wide, cover, onOpen, testid }) {
  const hasPhotos = images.length > 0;
  const coverSrc = cover || images[0];
  return (
    <button
      type="button"
      onClick={() => onOpen(label, images)}
      data-testid={testid}
      className="group relative w-full overflow-hidden rounded-2xl glass glass-navy text-left transition-transform duration-300 hover:-translate-y-1"
    >
      <div className={`relative w-full overflow-hidden ${wide ? "aspect-[16/6]" : "aspect-[4/3]"}`}>
        {hasPhotos ? (
          <img
            src={coverSrc}
            alt={label}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(20,41,132,0.16), rgba(20,41,132,0.05))" }}
            data-testid={`${testid}-empty`}
          >
            <span className="font-body text-sm text-[#142984]/45">Coming soon</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1240]/85 via-[#0a1240]/10 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
        <span className="font-head text-base lg:text-lg text-[#FFFCFA]">{label}</span>
        <span className="text-xs font-body text-[#FCDD15]">{hasPhotos ? `${images.length} photos` : "Coming soon"}</span>
      </div>
    </button>
  );
}

function YearNode({ year, glowStyle }) {
  return (
    <div className="flex justify-center">
      <div
        data-marker={year}
        style={glowStyle}
        className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#142984] border-2 border-[#FCDD15] shadow-lg shadow-[#142984]/30"
      >
        <span className="font-head text-xl text-[#FCDD15]">{year}</span>
      </div>
    </div>
  );
}

function GalleryModal({ data, onClose }) {
  const [idx, setIdx] = useState(0);
  const n = data ? data.images.length : 0;
  const prev = () => setIdx((i) => (i - 1 + n) % n);
  const next = () => setIdx((i) => (i + 1) % n);

  useEffect(() => { setIdx(0); }, [data]);

  useEffect(() => {
    if (!data) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + n) % n);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % n);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [data, onClose, n]);

  if (!data) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      data-testid="gallery-modal"
    >
      <div
        className="relative w-full max-w-5xl rounded-3xl bg-[#FFFCFA] p-4 lg:p-6"
        onClick={(e) => e.stopPropagation()}
        data-testid="gallery-modal-content"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-head text-xl lg:text-2xl text-[#142984]" data-testid="gallery-modal-title">{data.title}</h3>
          <button
            type="button"
            onClick={onClose}
            data-testid="gallery-close"
            aria-label="Close gallery"
            className="w-10 h-10 rounded-full bg-[#142984] text-[#FFFCFA] flex items-center justify-center hover:bg-[#FCDD15] hover:text-[#142984] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {n ? (
          <>
            <div className="relative w-full flex items-center justify-center">
              <img
                key={idx}
                src={data.images[idx]}
                alt={`${data.title} ${idx + 1}`}
                className="w-full max-h-[68vh] object-contain rounded-xl bg-black/5"
                data-testid={`gallery-img-${idx}`}
              />
              {n > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous photo"
                    data-testid="gallery-prev"
                    className="absolute left-2 lg:left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#142984]/90 text-[#FFFCFA] flex items-center justify-center hover:bg-[#FCDD15] hover:text-[#142984] transition-colors shadow-lg"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next photo"
                    data-testid="gallery-next"
                    className="absolute right-2 lg:right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#142984]/90 text-[#FFFCFA] flex items-center justify-center hover:bg-[#FCDD15] hover:text-[#142984] transition-colors shadow-lg"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>
            <div className="mt-3 text-center font-body text-sm text-[#142984]/70" data-testid="gallery-counter">
              {idx + 1} / {n}
            </div>
          </>
        ) : (
          <p className="font-body text-[#142984]/60">No photos yet — coming soon.</p>
        )}
      </div>
    </div>
  );
}

export default function LifeAtCGreen() {
  const [modal, setModal] = useState(null);
  const open = (title, images) => setModal({ title, images });

  const timelineRef = useRef(null);
  const [markerDelays, setMarkerDelays] = useState({});

  useLayoutEffect(() => {
    const measure = () => {
      const el = timelineRef.current;
      if (!el) return;
      const spinePad = 32; // matches top-8 / bottom-8 on the spine
      const total = el.offsetHeight - spinePad * 2;
      if (total <= 0) return;
      const nextDelays = {};
      el.querySelectorAll("[data-marker]").forEach((m) => {
        const centerY = m.offsetTop + m.offsetHeight / 2;
        const frac = Math.min(1, Math.max(0, (centerY - spinePad) / total));
        nextDelays[m.getAttribute("data-marker")] = +(frac * DURATION).toFixed(2);
      });
      setMarkerDelays(nextDelays);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const glowStyleFor = (year) =>
    markerDelays[year] != null
      ? { animation: `tl-marker-glow ${DURATION}s linear ${markerDelays[year]}s infinite` }
      : undefined;

  return (
    <div className="relative w-full min-h-screen bg-[#FFFCFA]" data-testid="life-at-cgreen-page">
      <Navbar />

      <section className="pt-36 pb-24 px-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="font-head text-4xl sm:text-5xl lg:text-6xl text-[#142984]" data-testid="life-heading">
            LIFE AT CGREEN
          </h1>
          <p className="font-body font-medium text-base md:text-lg text-[#142984]/70 mt-3">
            <span className="inline-block text-center px-5 py-2.5 rounded-full text-sm font-body font-bold leading-snug glass glass-yellow text-[#142984]" data-testid="life-subheading-pill">
              Moments from our Journey
            </span>
          </p>
          <p
            className="mt-4 italic text-base md:text-lg text-[#142984]/80"
            style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 500 }}
            data-testid="life-founding-line"
          >
            "CGreen commenced business from 11th Feb, 2023"
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative max-w-6xl mx-auto" data-testid="life-timeline">
          {/* triple metallic-blue circuit traces + travelling signal pulse (left side) */}
          <div
            className="absolute left-10 top-8 bottom-8 -translate-x-1/2 z-0 overflow-visible"
            style={{ width: "16px", "--tl-duration": `${DURATION}s` }}
            aria-hidden="true"
            data-testid="timeline-spine"
          >
            <span className="tl-trace absolute top-0 bottom-0 w-[2px] rounded-full" style={{ left: "3px" }} />
            <span className="tl-trace absolute top-0 bottom-0 w-[2px] rounded-full" style={{ left: "7px" }} />
            <span className="tl-trace absolute top-0 bottom-0 w-[2px] rounded-full" style={{ left: "11px" }} />
            <span className="tl-pulse absolute left-0 right-0" data-testid="timeline-pulse" />
          </div>

          <div className="relative z-10 flex flex-col gap-14">
            {TIMELINE.map((block) => (
              <motion.div
                key={block.year}
                className="flex items-start gap-6 md:gap-10"
                data-testid={`year-block-${block.year}`}
                {...YEAR_BLOCK}
              >
                <div className="shrink-0 w-20 flex justify-center">
                  <YearNode year={block.year} glowStyle={glowStyleFor(block.year)} />
                </div>
                <div className="flex-1 min-w-0">
                  {block.type === "cat" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {block.cats.map((c, ci) => (
                        <motion.div
                          key={c.key}
                          {...BOX_REVEAL}
                          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 + ci * 0.12 }}
                        >
                          <GalleryBox
                            label={c.label}
                            images={c.images}
                            cover={c.cover}
                            onOpen={(label, images) => open(`${block.year} — ${label}`, images)}
                            testid={`gallery-box-${block.year}-${c.key}`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      {...BOX_REVEAL}
                      transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                    >
                      <GalleryBox
                        wide
                        label={`${block.year} ${block.label}`}
                        images={block.images}
                        onOpen={(label, images) => open(label, images)}
                        testid={`gallery-box-${block.year}-pooled`}
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <GalleryModal data={modal} onClose={() => setModal(null)} />
    </div>
  );
}
