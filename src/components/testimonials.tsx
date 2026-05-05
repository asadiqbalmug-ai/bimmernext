import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Ahmed R.",
    role: "BMW M4 Owner",
    text: "Finally found people who can fix what others couldn't. True professionals!",
    stars: 5,
  },
  {
    name: "Saeed K.",
    role: "MINI Cooper S Owner",
    text: "Excellent service, honest advice and top-notch expertise. Highly recommend BimmerNext.",
    stars: 5,
  },
  {
    name: "Faisal Al Harmoodi",
    role: "Rolls-Royce Ghost Owner",
    text: "They handled my Rolls with the care and precision it deserves. The best in Ajman without a doubt.",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="bg-cream py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-3xl md:text-5xl text-black-main mb-12 uppercase tracking-tight font-bold">
          What Our Clients Say
        </h2>

        <div className="relative">
          {/* Left arrow */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full border border-black-main/20 flex items-center justify-center text-black-main hover:bg-black-main hover:text-white transition-colors z-10">
            <ChevronLeft size={18} />
          </button>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-cream border border-black-main/10 p-8 rounded-2xl flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} className="text-cyan fill-cyan" />
                  ))}
                </div>
                <p className="text-black-main text-sm leading-relaxed flex-1">
                  {t.text}
                </p>
                <div>
                  <p className="font-ui font-bold text-black-main text-sm">
                    {t.name}
                  </p>
                  <p className="text-muted-custom text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full border border-black-main/20 flex items-center justify-center text-black-main hover:bg-black-main hover:text-white transition-colors z-10">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <span className="w-2 h-2 rounded-full bg-cyan" />
          <span className="w-2 h-2 rounded-full bg-black-main/20" />
          <span className="w-2 h-2 rounded-full bg-black-main/20" />
          <span className="w-2 h-2 rounded-full bg-black-main/20" />
          <span className="w-2 h-2 rounded-full bg-black-main/20" />
        </div>
      </div>
    </section>
  );
}
