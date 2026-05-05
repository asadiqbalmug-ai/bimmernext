"use client";

export default function StructuredData() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: "BimmerNext",
    image: "https://bimmernext.ae/herologo.png",
    url: "https://bimmernext.ae",
    telephone: "+971523842422",
    email: "info@bimmernext.ae",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ajman",
      addressCountry: "AE",
      addressRegion: "Ajman",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.4052,
      longitude: 55.5136,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "14:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"],
        opens: "16:00",
        closes: "22:00",
      },
    ],
    priceRange: "$$",
    currenciesAccepted: "AED",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    areaServed: {
      "@type": "Country",
      name: "United Arab Emirates",
    },
    serviceType: [
      "BMW Repair",
      "MINI Service",
      "Rolls-Royce Maintenance",
      "Car Diagnostics",
      "European Car Specialist",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Car Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "BMW Repair & Maintenance",
            description: "Expert BMW repair, diagnostics, and maintenance in Ajman",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "MINI Cooper Service",
            description: "Specialized MINI Cooper servicing and repairs",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Rolls-Royce Workshop",
            description: "Luxury Rolls-Royce maintenance and repair services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Car Diagnostics",
            description: "Dealer-level diagnostics for all German vehicles",
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
    },
    sameAs: [
      "https://wa.me/971523842422",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BimmerNext",
    url: "https://bimmernext.ae",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://bimmernext.ae/services?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://bimmernext.ae",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://bimmernext.ae/services",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
