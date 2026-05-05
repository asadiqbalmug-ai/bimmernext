import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact BimmerNext for BMW, MINI & Rolls-Royce repair in Ajman. Book your car service, inspection, or get a quote today.",
  keywords: ["contact BimmerNext", "book car service Ajman", "BMW repair appointment", "car workshop contact UAE"],
  alternates: {
    canonical: "https://bimmernext.ae/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
