import type { Metadata } from "next";
import { Star, ArrowRight, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Read genuine customer reviews for BimmerNext - Ajman's trusted BMW, MINI & Rolls-Royce specialist workshop.",
  keywords: ["BimmerNext reviews", "BMW workshop reviews Ajman", "car repair testimonials UAE", "BimmerNext customer feedback"],
  alternates: {
    canonical: "https://bimmernext.ae/reviews",
  },
};

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
  {
    name: "Mohammed H.",
    role: "BMW X5 Owner",
    text: "Had a suspension issue that two other workshops couldn't diagnose. BimmerNext found it in 30 minutes and fixed it same day.",
    stars: 5,
  },
  {
    name: "Khalid A.",
    role: "BMW 7 Series Owner",
    text: "The coding and retrofitting service is incredible. They activated features I didn't even know my car had.",
    stars: 5,
  },
  {
    name: "Omar S.",
    role: "MINI Countryman Owner",
    text: "Fair pricing, transparent communication, and the car drives better than when I bought it. These guys know their stuff.",
    stars: 5,
  },
];

export default function ReviewsPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-black-main text-white pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-cyan text-xs font-ui font-bold tracking-widest uppercase mb-4">
            Reviews
          </p>
          <h1
            className="text-4xl md:text-6xl uppercase tracking-tight leading-[0.95] mb-6"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            What Our Clients<br />
            <span className="text-cyan">Say About Us.</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">
            95% client satisfaction. 1,000+ cars served. These are real stories from real 
            BMW, MINI, and Rolls-Royce owners across Ajman and the UAE.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="bg-cream py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-black-main/5 p-8 rounded-2xl flex flex-col gap-4 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-shadow"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} className="text-cyan fill-cyan" />
                  ))}
                </div>
                <p className="text-black-main text-sm leading-relaxed flex-1">
                  &ldquo;{t.text}&rdquo;
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
        </div>
      </section>

      {/* Stats + CTA */}
      <section className="bg-black-main text-white py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left">
              <div className="flex gap-1 justify-center md:justify-start mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} className="text-cyan fill-cyan" />
                ))}
              </div>
              <p className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                95% Client Satisfaction
              </p>
              <p className="text-white/60 text-sm">
                Based on 1,000+ completed services in Ajman
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-cyan text-black-main px-7 py-3 rounded-xl font-ui font-bold text-sm transition-all duration-300 hover:bg-[#01A5B1]"
              >
                Book Inspection <ArrowRight size={16} />
              </a>
              <a
                href="https://wa.me/971523842422"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-cyan text-cyan px-7 py-3 rounded-xl font-ui font-bold text-sm transition-all duration-300 hover:bg-cyan/10"
              >
                <MessageCircle size={16} /> Leave a Review
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
