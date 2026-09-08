import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X, CalendarDays, ArrowUpDown } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/sections/Footer";
import { BLOG_POSTS } from "@/data/site";

const CARD_REVEAL = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: "easeOut" },
};

const postTime = (p) => new Date(p.dateISO || p.date).getTime() || 0;

function BlogBody({ post }) {
  return (
    <div className="space-y-4">
      {post.body.map((block, i) => {
        if (typeof block === "string") {
          return (
            <p key={i} className="font-body text-[15px] leading-relaxed text-[#142984]/85">
              {block}
            </p>
          );
        }
        if (block.type === "heading") {
          return (
            <h3 key={i} className="font-head text-lg lg:text-xl text-[#142984] pt-2">
              {block.text}
            </h3>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={i}
              className="border-l-4 border-[#FCDD15] pl-4 py-1 my-2 font-body italic text-[15px] leading-relaxed text-[#142984]"
            >
              "{block.text}"
              {block.cite && (
                <footer className="mt-1 not-italic text-sm text-[#142984]/60">— {block.cite}</footer>
              )}
            </blockquote>
          );
        }
        return null;
      })}
    </div>
  );
}

function BlogModal({ post, onClose }) {
  useEffect(() => {
    if (!post) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [post, onClose]);

  if (!post) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      data-testid="blog-modal"
    >
      <div
        className="relative w-full max-w-3xl my-8 rounded-3xl bg-[#FFFCFA] p-5 sm:p-8"
        onClick={(e) => e.stopPropagation()}
        data-testid="blog-modal-content"
      >
        <button
          type="button"
          onClick={onClose}
          data-testid="blog-modal-close"
          aria-label="Close article"
          className="absolute right-4 top-4 w-10 h-10 rounded-full bg-[#142984] text-[#FFFCFA] flex items-center justify-center hover:bg-[#FCDD15] hover:text-[#142984] transition-colors"
        >
          <X size={20} />
        </button>

        <p className="flex items-center gap-1.5 font-body text-sm text-[#142984]/60 pr-12">
          <CalendarDays size={15} />
          {post.date}
          {post.author ? ` · ${post.author}` : ""}
        </p>
        <h2 className="font-head text-2xl lg:text-3xl text-[#142984] mt-2 mb-5">{post.headline}</h2>

        <img
          src={post.image}
          alt={post.imageAlt || post.headline}
          className="w-full rounded-2xl bg-black/5 mb-6"
        />

        <BlogBody post={post} />
      </div>
    </div>
  );
}

export default function Insight() {
  const [active, setActive] = useState(null);
  const [order, setOrder] = useState("newest"); // "newest" | "oldest"

  const posts = useMemo(() => {
    const sorted = [...BLOG_POSTS].sort((a, b) => postTime(b) - postTime(a));
    return order === "newest" ? sorted : sorted.reverse();
  }, [order]);

  return (
    <div className="relative w-full min-h-screen bg-[#FFFCFA]" data-testid="insight-page">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="font-head text-4xl sm:text-5xl lg:text-6xl text-[#142984]" data-testid="insight-heading">
            INSIGHT
          </h1>
          <p className="font-body font-medium text-base md:text-lg text-[#142984]/70 mt-3">
            <span className="inline-block px-5 py-2.5 rounded-full text-sm font-body font-bold glass glass-yellow text-[#142984]">
              News, perspectives and updates from CGreen
            </span>
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Sort filter — top left */}
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center gap-1.5 font-body text-sm text-[#142984]/60">
              <ArrowUpDown size={15} /> Sort by date
            </span>
            <div className="inline-flex rounded-full bg-[#142984]/[0.06] border border-[#142984]/10 p-1" role="group" data-testid="insight-sort">
              {[
                { key: "newest", label: "Newest" },
                { key: "oldest", label: "Oldest" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setOrder(opt.key)}
                  data-testid={`insight-sort-${opt.key}`}
                  aria-pressed={order === opt.key}
                  className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-colors ${order === opt.key
                    ? "bg-[#142984] text-[#FFFCFA]"
                    : "text-[#142984] hover:bg-[#142984]/10"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Blog list — photo left, headline + date right */}
          <div className="flex flex-col gap-12">
            {posts.map((post) => (
              <motion.button
                key={post.slug}
                type="button"
                onClick={() => setActive(post)}
                data-testid={`blog-card-${post.slug}`}
                className="
        group
        w-full
        flex flex-col sm:flex-row
        gap-3
        p-3
        text-left
        bg-white  
        rounded-3xl
        border border-[#142984]/10
        shadow-sm
        hover:shadow-xl
        hover:border-[#142984]/20
        transition-all duration-300
      "
                {...CARD_REVEAL}
              >
                {/* Image */}
                <div
                  className="
          relative
          w-full
          sm:w-[280px]
          md:w-[320px]
          lg:w-[350px]
          shrink-0
          h-[210px]
          sm:h-[200px]
          md:h-[210px]
          lg:h-[220px]
          overflow-hidden
          rounded-2xl
           bg-white
        "
                >
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.headline}
                    loading="lazy"
                    className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            rounded-2xl
            transition-transform
            duration-500
            ease-out
            group-hover:scale-105" />

                  {/* Subtle image overlay */}
                  <div
                    className="
            absolute inset-0
            rounded-2xl
            bg-gradient-to-t
            from-[#142984]/10
            via-transparent
            to-transparent
            pointer-events-none
          "
                  />
                </div>

                {/* Content */}
                <div
                  className="
          flex-1
          flex flex-col
          justify-center
          px-3
          py-0
          sm:px-4
          md:px-5
          lg:px-6
        "  >
                  <h2
                    className="
            font-head
            text-lg
            md:text-1xl
            font-semibold
            text-[#142984]
            leading-snug
            transition-colors
            duration-300
            group-hover:text-[#0d1b5c]
          "
                  >
                    {post.headline}
                  </h2>

                  <div
                    className="
            flex items-center
            gap-2
            mt-8
            font-body
            text-sm
            text-[#142984]/55
          "
                  >
                    <CalendarDays
                      size={15}
                      strokeWidth={1.8}
                    />

                    <span>{post.date}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <BlogModal post={active} onClose={() => setActive(null)} />
    </div>
  );
}
