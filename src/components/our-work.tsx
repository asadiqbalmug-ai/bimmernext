import { ArrowRight } from "lucide-react";

const images = [
  "/1a.JPG",
  "/2a.JPG",
  "/3a.JPG",
  "/4a.JPG",
  "/5a.JPG",
];

export default function OurWork() {
  return (
    <section id="work" className="bg-cream pt-6 pb-10 md:pt-8 md:pb-14">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-ui font-bold tracking-widest text-muted-custom uppercase mb-3">
              Our Work
            </p>
            <h2
              className="text-3xl md:text-5xl text-black-main uppercase tracking-tight"
              style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
            >
              Real Cars. Real Results.
            </h2>
          </div>
          <a
            href="#work"
            className="inline-flex items-center gap-2 border border-black-main text-black-main px-6 py-2.5 rounded-xl font-ui font-semibold text-sm transition-all duration-300 hover:bg-black-main hover:text-white shrink-0"
          >
            View Gallery <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('${src}')` }}
              />
              <div className="absolute inset-0 bg-black-main/20 group-hover:bg-black-main/10 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
