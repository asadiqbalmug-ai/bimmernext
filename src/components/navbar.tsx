"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/about" },
  { label: "SERVICES", href: "/services" },
  { label: "OUR WORK", href: "/work" },
  { label: "WHY US", href: "/why-us" },
  { label: "REVIEWS", href: "/reviews" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-b from-cream via-cream/95 to-transparent"
          : "bg-cream"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-14 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/bnlogo__1_-removebg-preview.png"
            alt="BimmerNext"
            className="h-9 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-xs font-ui font-bold tracking-widest transition-colors ${
                pathname === link.href
                  ? "text-cyan"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center bg-cyan text-white px-6 py-2.5 rounded-lg font-ui font-semibold text-sm hover:bg-blue transition-all"
          >
            Book Inspection
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-black p-2 -mr-2"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="lg:hidden bg-cream">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm font-ui font-semibold tracking-widest transition-colors ${
                  pathname === link.href ? "text-cyan" : "text-gray-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-cyan text-white px-5 py-3 rounded-lg font-ui font-semibold text-sm hover:bg-blue transition-all mt-2"
            >
              Book Inspection
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
