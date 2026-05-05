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
    <footer id="contact" className="bg-cream text-black-main py-16 border-t border-black-main/10">
      <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center mb-4">
            <img
              src="/bnlogo__1_-removebg-preview.png"
              alt="BimmerNext"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="text-black-main/70 text-sm leading-relaxed">
            Ajman&apos;s trusted BMW, MINI & Rolls-Royce specialists.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-ui font-semibold text-sm mb-4 tracking-wider">QUICK LINKS</h4>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-muted-custom text-sm hover:text-cyan transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-ui font-semibold text-sm mb-4 tracking-wider">CONTACT US</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-muted-custom text-sm">
              <Phone size={14} className="text-cyan" /> +971 50 123 4567
            </li>
            <li className="flex items-center gap-2 text-muted-custom text-sm">
              <Mail size={14} className="text-cyan" /> info@bimmernext.ae
            </li>
            <li className="flex items-start gap-2 text-muted-custom text-sm">
              <MapPin size={14} className="text-cyan mt-0.5" /> Ajman, UAE
            </li>
          </ul>
        </div>

        {/* Working Hours */}
        <div>
          <h4 className="font-ui font-semibold text-sm mb-4 tracking-wider">WORKING HOURS</h4>
          <ul className="space-y-2 text-muted-custom text-sm">
            <li className="flex items-center gap-2">
              <Clock size={14} className="text-cyan" /> Monday - Saturday
            </li>
            <li>9:00 AM - 7:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a href="#" className="w-8 h-8 rounded-full bg-black-main/10 flex items-center justify-center hover:bg-cyan transition-colors">
              <Globe size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-black-main/10 flex items-center justify-center hover:bg-cyan transition-colors">
              <MessageCircle size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mt-12 pt-6 border-t border-black-main/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-black-main/60 text-xs">
          &copy; 2026 BimmerNext. All rights reserved.
        </p>
        <p className="text-black-main/60 text-xs">
          Crafted with precision in Ajman, UAE
        </p>
      </div>
    </footer>
  );
}
