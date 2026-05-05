"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", car: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <>
      {/* Page Header */}
      <section className="bg-black-main text-white pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-cyan text-xs font-ui font-bold tracking-widest uppercase mb-4">
            Contact Us
          </p>
          <h1
            className="text-4xl md:text-6xl uppercase tracking-tight leading-[0.95] mb-6"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            Let&apos;s Get Your<br />
            <span className="text-cyan">Bimmer Back on Track.</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">
            Book an inspection, ask a question, or just say hello. We respond fast — 
            usually within minutes on WhatsApp.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="bg-cream py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Form */}
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-ui font-bold uppercase tracking-wider text-black-main mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white border border-black-main/10 rounded-xl px-4 py-3 text-sm text-black-main focus:outline-none focus:border-cyan transition-colors"
                      placeholder="Ahmed Al Mansouri"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-ui font-bold uppercase tracking-wider text-black-main mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-white border border-black-main/10 rounded-xl px-4 py-3 text-sm text-black-main focus:outline-none focus:border-cyan transition-colors"
                      placeholder="052 384 2422"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-ui font-bold uppercase tracking-wider text-black-main mb-2">
                      Car Model
                    </label>
                    <input
                      type="text"
                      required
                      value={form.car}
                      onChange={(e) => setForm({ ...form, car: e.target.value })}
                      className="w-full bg-white border border-black-main/10 rounded-xl px-4 py-3 text-sm text-black-main focus:outline-none focus:border-cyan transition-colors"
                      placeholder="BMW 3 Series 2020"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-ui font-bold uppercase tracking-wider text-black-main mb-2">
                      Service Needed
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full bg-white border border-black-main/10 rounded-xl px-4 py-3 text-sm text-black-main focus:outline-none focus:border-cyan transition-colors"
                    >
                      <option value="">Select a service</option>
                      <option value="diagnostics">Diagnostics</option>
                      <option value="engine">Engine / Transmission</option>
                      <option value="electrical">Electrical / Coding</option>
                      <option value="suspension">Suspension / Performance</option>
                      <option value="maintenance">Preventive Maintenance</option>
                      <option value="other">Other / Not Sure</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-ui font-bold uppercase tracking-wider text-black-main mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white border border-black-main/10 rounded-xl px-4 py-3 text-sm text-black-main focus:outline-none focus:border-cyan transition-colors resize-none"
                    placeholder="Describe the issue or what you need..."
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-cyan text-black-main px-7 py-3 rounded-xl font-ui font-bold text-sm transition-all duration-300 hover:bg-[#01A5B1] hover:-translate-y-0.5"
                >
                  {submitted ? "Message Sent!" : "Send Message"} <Send size={16} />
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <p className="text-xs font-ui font-bold uppercase tracking-wider text-muted-custom mb-4">
                  Reach Us Directly
                </p>
                <div className="space-y-4">
                  <a
                    href="tel:+971523842422"
                    className="flex items-center gap-3 text-black-main hover:text-cyan transition-colors"
                  >
                    <span className="w-10 h-10 rounded-full bg-cyan/10 flex items-center justify-center">
                      <Phone size={18} className="text-cyan" />
                    </span>
                    <span className="text-sm font-semibold">052 384 2422</span>
                  </a>
                  <a
                    href="https://wa.me/971523842422"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-black-main hover:text-cyan transition-colors"
                  >
                    <span className="w-10 h-10 rounded-full bg-cyan/10 flex items-center justify-center">
                      <MessageCircle size={18} className="text-cyan" />
                    </span>
                    <span className="text-sm font-semibold">WhatsApp Us</span>
                  </a>
                  <a
                    href="mailto:info@bimmernext.ae"
                    className="flex items-center gap-3 text-black-main hover:text-cyan transition-colors"
                  >
                    <span className="w-10 h-10 rounded-full bg-cyan/10 flex items-center justify-center">
                      <Mail size={18} className="text-cyan" />
                    </span>
                    <span className="text-sm font-semibold">info@bimmernext.ae</span>
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs font-ui font-bold uppercase tracking-wider text-muted-custom mb-4">
                  Workshop Location
                </p>
                <div className="space-y-4">
                  <a
                    href="https://maps.app.goo.gl/CsQEQvC21EebCrHM9?g_st=aw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-black-main hover:text-cyan transition-colors"
                  >
                    <span className="w-10 h-10 rounded-full bg-cyan/10 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-cyan" />
                    </span>
                    <span className="text-sm">Ajman, UAE</span>
                  </a>
                  <div className="flex items-start gap-3 text-black-main">
                    <span className="w-10 h-10 rounded-full bg-cyan/10 flex items-center justify-center shrink-0">
                      <Clock size={18} className="text-cyan" />
                    </span>
                    <div className="text-sm">
                      <p>Mon – Thu, Sat – Sun</p>
                      <p className="font-semibold">9 AM – 2 PM, 4 – 10 PM</p>
                      <p className="text-red-500 font-semibold mt-1">Friday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="/work"
                className="inline-flex items-center gap-2 border border-black-main text-black-main px-6 py-2.5 rounded-lg font-ui font-bold text-sm transition-all duration-300 hover:bg-black-main hover:text-white"
              >
                See Our Work <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
