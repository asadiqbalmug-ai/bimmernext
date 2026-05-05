import { ArrowRight, MessageCircle } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative bg-black-main text-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-0 md:pl-6 md:pr-2 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center min-h-auto md:min-h-[280px]">
        {/* Left: Text */}
        <div className="py-2 md:py-8 md:-ml-4">
          <h2
            className="text-2xl sm:text-3xl md:text-5xl uppercase tracking-tight leading-[0.95] mb-2"
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
        <div className="relative flex flex-col-reverse md:flex-row items-center gap-4 md:gap-4 md:h-full">
          {/* Buttons */}
          <div className="flex flex-col gap-3 w-full md:w-auto md:shrink-0 md:mb-2 md:translate-x-8 lg:translate-x-16">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-cyan text-black-main px-5 md:px-6 py-3 rounded-lg font-ui font-bold text-sm transition-all duration-300 hover:bg-[#01A5B1]"
            >
              BOOK INSPECTION <ArrowRight size={16} />
            </a>
            <a
              href="https://wa.me/971501234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-cyan text-cyan px-5 md:px-6 py-3 rounded-lg font-ui font-bold text-sm transition-all duration-300 hover:bg-cyan/10"
            >
              <MessageCircle size={16} /> WHATSAPP US
            </a>
          </div>
          {/* Car image */}
          <div className="relative w-full h-40 md:flex-1 md:h-full overflow-hidden">
            <img
              src="/2d (1).JPG"
              alt="BMW Front"
              className="w-full h-full object-contain object-center md:object-right scale-110 md:scale-[1.6]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
