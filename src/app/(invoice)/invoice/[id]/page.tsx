import type { Metadata } from "next";
import InvoiceView from "./invoice-view";

export const metadata: Metadata = {
  title: "Invoice | BimmerNext",
  robots: { index: false, follow: false },
};

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ id: "5171" }];
}

export default function InvoicePage({ params }: { params: { id: string } }) {
  return <InvoiceView id={params.id} />;
}
