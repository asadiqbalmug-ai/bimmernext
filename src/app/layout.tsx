import type { Metadata } from "next";
import { Alfa_Slab_One, Bebas_Neue, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FloatingWhatsAppWrapper from "@/components/floating-whatsapp-wrapper";

const alfaSlabOne = Alfa_Slab_One({
  weight: "400",
  variable: "--font-alfa",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BimmerNext | BMW, MINI & Rolls-Royce Specialists in Ajman",
  description:
    "Ajman's most trusted BMW, MINI and Rolls-Royce specialists. Dealer-level diagnostics, real expertise, no guesswork. Book your inspection now.",
  icons: {
    icon: "/faviconbimmer.png",
    shortcut: "/faviconbimmer.png",
    apple: "/faviconbimmer.png",
  },
  openGraph: {
    title: "BimmerNext | BMW, MINI & Rolls-Royce Specialists in Ajman",
    description:
      "Ajman's most trusted BMW, MINI and Rolls-Royce specialists. Dealer-level diagnostics, real expertise, no guesswork.",
    url: "https://bimmernext.ae",
    siteName: "BimmerNext",
    images: [
      {
        url: "/herologo.png",
        width: 1200,
        height: 630,
        alt: "BimmerNext - BMW & MINI Specialists",
      },
    ],
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BimmerNext | BMW, MINI & Rolls-Royce Specialists in Ajman",
    description:
      "Ajman's most trusted BMW, MINI and Rolls-Royce specialists. Dealer-level diagnostics, real expertise, no guesswork.",
    images: ["/herologo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${alfaSlabOne.variable} ${bebasNeue.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-black-main">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsAppWrapper />
      </body>
    </html>
  );
}
