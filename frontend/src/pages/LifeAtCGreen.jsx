import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/sections/Footer";

// Placeholder images (swapped for real photos later). Counts vary per category.
const imgs = (seed, n) =>
  Array.from({ length: n }, (_, i) => `https://picsum.photos/seed/cgreen-${seed}-${i}/640/480`);

const TIMELINE = [
  {
    year: "2026",
    type: "cat",
    cats: [
      { key: "business", label: "Business Events", images: imgs("2026-business", 5) },
      { key: "cultural", label: "Cultural Event", images: imgs("2026-cultural", 4) },
      { key: "team", label: "Team Photos", images: imgs("2026-team", 6) },
    ],
  },
  {
    year: "2025",
    type: "cat",
    cats: [
      { key: "business", label: "Business Events", images: imgs("2025-business", 6) },
      { key: "cultural", label: "Cultural Event", images: imgs("2025-cultural", 3) },
      { key: "team", label: "Team Photos", images: imgs("2025-team", 5) },
    ],
  },
  { year: "2024", type: "pool", label: "Highlights", images: imgs("2024-pool", 8) },
  { year: "2023", type: "pool", label: "Highlights", images: imgs("2023-pool", 5) },
];

function GalleryBox({ label, images, wide, onOpen, testid }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(label, images)}
      data-testid={testid}
      className="group relative w-full overflow-hidden rounded-2xl glass glass-navy text-left transition-transform duration-300 hover:-translate-y-1"
    >
      <div className={`relative w-full overflow-hidden ${wide ? "aspect-[16/6]" : "aspect-[4/3]"}`}>
        <img
          src={images[0]}
          alt={label}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1240]/85 via-[#0a1240]/10 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
        <span className="font-head text-base lg:text-lg text-[#FFFCFA]">{label}</span>
        <span className="text-xs font-body text-[#FCDD15]">{images.length} photos</span>
      </div>
    </button>
  );
}

function YearNode({ year }) {
  return (
    <div className="flex justify-center">
      <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#142984] border-2 border-[#FCDD15] shadow-lg shadow-[#142984]/30">
        <span className="font-head text-xl text-[#FCDD15]">{year}</span>
      </div>
    </div>
  );
}

function GalleryModal({ data, onClose }) {
  useEffect(() => {
    if (!data) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [data, onClose]);

  if (!data) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      data-testid="gallery-modal"
    >
      <div
        className="relative w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#FFFCFA] p-6 lg:p-8"
        onClick={(e) => e.stopPropagation()}
        data-testid="gallery-modal-content"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-head text-2xl text-[#142984]" data-testid="gallery-modal-title">{data.title}</h3>
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
        {data.images.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${data.title} ${i + 1}`}
                className="w-full aspect-[4/3] object-cover rounded-xl"
                loading="lazy"
                data-testid={`gallery-img-${i}`}
              />
            ))}
          </div>
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

  return (
    <div className="relative w-full min-h-screen bg-[#FFFCFA]" data-testid="life-at-cgreen-page">
      <Navbar />

      <section className="pt-36 pb-24 px-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="font-head text-4xl sm:text-5xl lg:text-6xl text-[#142984]" data-testid="life-heading">
            LIFE AT CGREEN
          </h1>
          <p className="font-body font-light text-base md:text-lg text-[#142984]/70 mt-3">
            Moments from our Journey
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto" data-testid="life-timeline">
          {/* metallic-blue animated spine */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-[3px] rounded-full timeline-line"
            aria-hidden="true"
            data-testid="timeline-line"
          />

          <div className="relative z-10 flex flex-col gap-16">
            {TIMELINE.map((block) => (
              <div key={block.year} data-testid={`year-block-${block.year}`}>
                <YearNode year={block.year} />
                <div className="mt-8">
                  {block.type === "cat" ? (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {block.cats.map((c) => (
                        <GalleryBox
                          key={c.key}
                          label={c.label}
                          images={c.images}
                          onOpen={(label, images) => open(`${block.year} — ${label}`, images)}
                          testid={`gallery-box-${block.year}-${c.key}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <GalleryBox
                      wide
                      label={`${block.year} ${block.label}`}
                      images={block.images}
                      onOpen={(label, images) => open(label, images)}
                      testid={`gallery-box-${block.year}-pooled`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <GalleryModal data={modal} onClose={() => setModal(null)} />
    </div>
  );
}
