import { Check, ArrowRight } from "lucide-react";

const bullets = [
  "Ex-BMW trained technicians",
  "Hands-on owner involvement",
  "Specialists in complex issues",
  "Premium service approach",
  "Hundreds of happy clients in Ajman",
];

export default function Expertise() {
  return (
    <section id="why-us" className="bg-black-main text-white relative overflow-hidden">
      <div className="grid md:grid-cols-2 min-h-[400px] items-stretch">
        {/* Left: Full-bleed image */}
        <div className="relative min-h-[300px] md:min-h-0">
          <img
            src="/YYGYGY.JPG"
            alt="BimmerNext Workshop"
            className="w-full h-full object-cover"
            style={{ objectPosition: "left center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black-main/60 to-transparent" />
          {/* Right-edge blur divider */}
          <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-black-main via-black-main/70 to-transparent" />
        </div>

        {/* Right: Text content */}
        <div className="py-20 md:py-28 px-6 md:px-12 lg:px-20 flex flex-col justify-center">
          <p className="text-cyan font-ui text-sm font-semibold tracking-widest uppercase mb-3">
            Why Choose BimmerNext?
          </p>
          <h2 className="text-4xl md:text-5xl mb-6 leading-tight">
            Expertise You Can Trust. <br />
            <span className="text-cyan">Results You Can Feel.</span>
          </h2>
          <p className="text-muted-custom mb-6 leading-relaxed">
            Built on passion, precision and experience. Our founder works
            hands-on with every car. We don&apos;t just fix cars — we solve
            problems others couldn&apos;t.
          </p>
          <ul className="space-y-3 mb-8">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-muted-custom">
                <span className="w-5 h-5 rounded-full bg-cyan flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <a
            href="/about"
            className="inline-flex items-center justify-center gap-2 bg-cyan text-black-main px-7 py-3 rounded-xl font-ui font-semibold transition-all duration-300 hover:bg-blue hover:shadow-glow hover:-translate-y-1 w-1/2"
          >
            Learn More About Us <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
