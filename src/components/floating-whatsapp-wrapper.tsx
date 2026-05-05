"use client";

import { usePathname } from "next/navigation";
import FloatingWhatsApp from "./floating-whatsapp";

export default function FloatingWhatsAppWrapper() {
  const pathname = usePathname();
  // Don't show on CRM pages
  if (pathname?.startsWith("/crm")) return null;
  return <FloatingWhatsApp />;
}
