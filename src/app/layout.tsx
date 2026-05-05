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
  metadataBase: new URL("https://bimmernext.ae"),
  title: {
    default: "BimmerNext | BMW, MINI & Rolls-Royce Specialists in Ajman, UAE",
    template: "%s | BimmerNext - UAE Car Workshop",
  },
  description:
    "Premium BMW, MINI & Rolls-Royce car repair workshop in Ajman, UAE. Dealer-level diagnostics, expert mechanics, genuine parts. Book your car service, inspection, or maintenance today.",
  keywords: [
    "BMW repair Ajman",
    "MINI service UAE",
    "Rolls-Royce workshop Dubai",
    "car repair Ajman",
    "BMW specialist UAE",
    "German car workshop",
    "luxury car repair",
    "car diagnostics UAE",
    "auto repair Ajman",
    "BMW maintenance",
    "car garage Ajman",
    "European car specialist",
    "BMW mechanic",
    "car service center",
    "automotive repair UAE",
  ],
  authors: [{ name: "BimmerNext" }],
  creator: "BimmerNext",
  publisher: "BimmerNext",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/faviconbimmer.png",
    shortcut: "/faviconbimmer.png",
    apple: "/faviconbimmer.png",
  },
  manifest: "/manifest.json",
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
        alt: "BimmerNext - BMW & MINI Specialists in Ajman UAE",
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
    creator: "@bimmernext",
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
  category: "Automotive",
  classification: "Car Repair & Maintenance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AE"
      dir="ltr"
      className={`${alfaSlabOne.variable} ${bebasNeue.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <meta name="geo.region" content="AE-AJ" />
        <meta name="geo.placename" content="Ajman" />
        <meta name="geo.position" content="25.4052;55.5136" />
        <meta name="ICBM" content="25.4052, 55.5136" />
        <meta name="apple-mobile-web-app-title" content="BimmerNext" />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-black-main">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsAppWrapper />
      </body>
    </html>
  );
}
