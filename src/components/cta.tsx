import { ArrowRight, MessageCircle } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative bg-black-main text-white overflow-hidden">
      {/* Desktop: original side-by-side layout */}
      <div className="hidden md:grid max-w-[1200px] mx-auto pl-6 pr-0 md:pr-2 grid-cols-2 gap-8 items-center min-h-[280px]">
        {/* Left: Text */}
        <div className="py-8 -ml-4">
          <h2
            className="text-5xl uppercase tracking-tight leading-[0.95] mb-2"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            Stop Guessing.
            <br />
            <span className="text-cyan">Bring It to the Specialists.</span>
          </h2>
          <p className="text-white/80 text-xs font-ui font-bold tracking-wide uppercase">
            BMW. MINI. ROLLS-ROYCE. Only The Best.
          </p>
        </div>

        {/* Right: Car Image + Buttons */}
        <div className="relative h-full flex flex-row items-center justify-between gap-4">
          <div className="flex-1 relative h-full">
            <img
              src="/2d (1).JPG"
              alt="BMW Front"
              className="absolute inset-0 w-full h-full object-contain object-right scale-[1.6]"
            />
          </div>
          <div className="flex flex-col gap-3 mb-2 shrink-0 translate-x-16">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-cyan text-black-main px-6 py-2.5 rounded-lg font-ui font-bold text-sm transition-all duration-300 hover:bg-[#01A5B1]"
            >
              BOOK INSPECTION <ArrowRight size={16} />
            </a>
            <a
              href="https://wa.me/971523842422"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-cyan text-cyan px-6 py-2.5 rounded-lg font-ui font-bold text-sm transition-all duration-300 hover:bg-cyan/10"
            >
              <MessageCircle size={16} /> WHATSAPP US
            </a>
          </div>
        </div>
      </div>

      {/* Mobile: stacked layout */}
      <div className="md:hidden max-w-[1200px] mx-auto px-6 py-10 space-y-6">
        {/* Text */}
        <div>
          <h2
            className="text-3xl uppercase tracking-tight leading-[0.95] mb-2"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            Stop Guessing.
            <br />
            <span className="text-cyan">Bring It to the Specialists.</span>
          </h2>
          <p className="text-white/80 text-xs font-ui font-bold tracking-wide uppercase">
            BMW. MINI. ROLLS-ROYCE. Only The Best.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-cyan text-black-main px-6 py-3 rounded-lg font-ui font-bold text-sm transition-all duration-300 hover:bg-[#01A5B1]"
          >
            BOOK INSPECTION <ArrowRight size={16} />
          </a>
          <a
            href="https://wa.me/971523842422"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-cyan text-cyan px-6 py-3 rounded-lg font-ui font-bold text-sm transition-all duration-300 hover:bg-cyan/10"
          >
            <MessageCircle size={16} /> WHATSAPP US
          </a>
        </div>

        {/* Car image */}
        <div className="relative w-full h-48">
          <img
            src="/2d (1).JPG"
            alt="BMW Front"
            className="w-full h-full object-contain object-center scale-110"
          />
        </div>
      </div>
    </section>
  );
}
