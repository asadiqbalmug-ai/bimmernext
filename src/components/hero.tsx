"use client";

import { ArrowRight, MessageCircle } from "lucide-react";

const trustItems = [
  { img: "/1a1a1__1_-removebg-preview.png", label: "EX-BMW", sub: "EXPERIENCE" },
  { img: "/2a2a2__1_-removebg-preview.png", label: "HANDS-ON", sub: "OWNER" },
  { img: "/3a3a3__1_-removebg-preview.png", label: "COMPLEX ISSUE", sub: "SPECIALISTS" },
  { img: "/4a4a4__1_-removebg-preview.png", label: "100% CLIENT", sub: "SATISFACTION" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] pt-16 md:pt-20 overflow-hidden flex items-center">
      {/* Desktop: solid cream left, image RIGHT with feathered left edge */}
      <div className="hidden md:block absolute inset-0 bg-cream" />
      <div className="hidden md:block absolute top-0 right-0 bottom-0 w-[65%]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/lapbg.png')" }}
        />
        {/* Feathered left edge on image — soft gradient into cream */}
        <div
          className="absolute inset-y-0 left-0 w-[25%]"
          style={{
            background:
              "linear-gradient(to right, #F5EFE6 0%, #F5EFE6 15%, rgba(245,239,230,0.7) 45%, transparent 100%)",
          }}
        />
      </div>

      {/* Mobile: full background image */}
      <div className="absolute inset-0 md:hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/mobbg.png')" }}
        />
        <div className="absolute inset-0 bg-cream/85" />
      </div>

      {/* BimmerNext logo overlay on image — desktop only, centered above middle car */}
      <div className="hidden md:flex absolute top-16 lg:top-20 left-[60%] lg:left-[62%] z-20 -translate-x-1/2 items-center">
        <img
          src="/herologo.png"
          alt="BimmerNext"
          className="h-12 lg:h-16 w-auto object-contain drop-shadow-lg"
        />
      </div>

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 flex items-center">
        <div className="w-full md:w-[32%] py-8 md:py-10">
          {/* Eyebrow */}
          <p className="text-cyan font-ui text-sm font-bold tracking-[0.2em] uppercase mb-3">
            AJMAN&apos;S MOST TRUSTED
          </p>

          {/* Display heading — Alfa Slab One */}
          <h1
            className="text-black uppercase leading-[0.9] tracking-tight font-bold"
            style={{
              fontFamily: "var(--font-alfa), ui-serif, Georgia, serif",
              fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
            }}
          >
            BMW & MINI
          </h1>
          <h2
            className="text-cyan uppercase leading-[0.9] tracking-tight mb-5 font-bold"
            style={{
              fontFamily: "var(--font-alfa), ui-serif, Georgia, serif",
              fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
            }}
          >
            SPECIALISTS
          </h2>

          {/* Subtitle */}
          <p className="text-gray-700 mb-6 max-w-md text-sm md:text-base leading-relaxed font-ui font-semibold">
            Dealer-Level Diagnostics.
            <br />
            Real Expertise. No Guesswork.
            <br />
            We fix what others can&apos;t.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-5">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-cyan text-white px-6 py-3 rounded-lg font-ui font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-blue hover:-translate-y-0.5"
            >
              BOOK INSPECTION <ArrowRight size={16} />
            </a>
            <a
              href="https://wa.me/971523842422"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-ui font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-black hover:-translate-y-0.5"
            >
              <MessageCircle size={16} /> WHATSAPP US
            </a>
          </div>

          {/* Trust items — single row, compact */}
          <div className="flex gap-x-3 gap-y-0">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-cream overflow-hidden flex-shrink-0">
                  <img src={item.img} alt="" className="w-5 h-5 object-contain" />
                </div>
                <div className="leading-tight">
                  <p className="text-[9px] font-ui font-bold tracking-wider text-black leading-none uppercase">
                    {item.label}
                  </p>
                  <p className="text-[9px] text-gray-500 font-ui font-medium tracking-wider uppercase leading-none">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
