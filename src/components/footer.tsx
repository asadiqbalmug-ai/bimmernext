"use client";

import { Phone, Mail, MapPin, Clock, Globe, MessageCircle } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/work" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-cream text-black-main py-10 md:py-16 border-t border-black-main/10">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center mb-3 md:mb-4">
            <img
              src="/bnlogo__1_-removebg-preview.png"
              alt="BimmerNext"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </Link>
          <p className="text-black-main/70 text-xs md:text-sm leading-relaxed">
            Ajman&apos;s trusted BMW, MINI & Rolls-Royce specialists.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-ui font-semibold text-xs md:text-sm mb-3 md:mb-4 tracking-wider">QUICK LINKS</h4>
          <ul className="space-y-1.5 md:space-y-2">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-muted-custom text-xs md:text-sm hover:text-cyan transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-ui font-semibold text-xs md:text-sm mb-3 md:mb-4 tracking-wider">CONTACT US</h4>
          <ul className="space-y-2 md:space-y-3">
            <li className="flex items-center gap-2 text-muted-custom text-xs md:text-sm">
              <Phone size={12} className="text-cyan md:w-[14px] md:h-[14px]" /> 052 384 2422
            </li>
            <li className="flex items-center gap-2 text-muted-custom text-xs md:text-sm">
              <Mail size={12} className="text-cyan md:w-[14px] md:h-[14px]" /> info@bimmernext.ae
            </li>
            <li className="flex items-start gap-2 text-muted-custom text-xs md:text-sm">
              <a href="https://maps.app.goo.gl/CsQEQvC21EebCrHM9?g_st=aw" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-muted-custom hover:text-cyan transition-colors">
              <MapPin size={12} className="text-cyan mt-0.5 md:w-[14px] md:h-[14px]" /> Ajman, UAE
            </a>
            </li>
          </ul>
        </div>

        {/* Working Hours */}
        <div>
          <h4 className="font-ui font-semibold text-xs md:text-sm mb-3 md:mb-4 tracking-wider">WORKING HOURS</h4>
          <ul className="space-y-1.5 md:space-y-2 text-muted-custom text-xs md:text-sm">
            <li className="flex items-center gap-2">
              <Clock size={12} className="text-cyan md:w-[14px] md:h-[14px]" /> Mon–Thu, Sat–Sun
            </li>
            <li>9 AM – 2 PM, 4–10 PM</li>
            <li className="text-red-400 font-semibold">Friday: Closed</li>
          </ul>
          <div className="flex gap-2 md:gap-3 mt-3 md:mt-4">
            <a href="#" className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-black-main/10 flex items-center justify-center hover:bg-cyan transition-colors">
              <Globe size={12} className="md:w-[14px] md:h-[14px]" />
            </a>
            <a href="#" className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-black-main/10 flex items-center justify-center hover:bg-cyan transition-colors">
              <MessageCircle size={12} className="md:w-[14px] md:h-[14px]" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mt-8 md:mt-12 pt-4 md:pt-6 border-t border-black-main/10 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
        <p className="text-black-main/60 text-[10px] md:text-xs">
          &copy; 2026 BimmerNext. All rights reserved.
        </p>
        <p className="text-black-main/60 text-[10px] md:text-xs">
          Crafted with precision in Ajman, UAE
        </p>
      </div>
    </footer>
  );
}
