# BimmerNext Brand Guidelines

## Overview
BimmerNext is Ajman's premium BMW, MINI & Rolls-Royce auto workshop. The brand identity communicates precision, luxury, and technical mastery through a dark, high-contrast visual system with signature cyan accents.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `black-main` | `#0A0A0A` | Primary background, hero dark overlays |
| `black-soft` | `#121212` | Secondary background (brands bar) |
| `black-elevated` | `#1A1A1A` | Cards, elevated surfaces, nav backdrop |
| `cream` | `#F5EFE6` | Light section backgrounds (services, stats, gallery) |
| `white` | `#FAFAFA` | Primary text on dark, card backgrounds |
| `cyan` | `#00C2C7` | Primary accent — CTAs, highlights, hover states |
| `blue` | `#0094FF` | Secondary accent — CTA hover, glow effects |
| `red` | `#FF3131` | Destructive / error states |
| `muted-custom` | `#8A8A8A` | Secondary text, descriptions |

### Usage Rules
- Dark sections: `black-main` background + `white` text + `cyan` accent
- Light sections: `cream` background + `black-main` text + `cyan` accent
- Always maintain high contrast between text and backgrounds

---

## Typography

### Font Stack
| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Headings | Bebas Neue | 400 | H1-H6, all caps, section titles, logo |
| Body / UI | Inter | 400-700 | Paragraphs, descriptions, general text |
| Buttons / Labels | Poppins | 400-700 | CTAs, nav links, badges, small labels |

### Scale (approximate)
- H1 (Hero): `text-5xl` mobile / `text-7xl` desktop, leading tight (`leading-[0.95]`)
- H2 (Section): `text-3xl` mobile / `text-5xl` desktop
- H3 (Card titles): `text-xl`
- Body: `text-sm` to `text-base`
- Labels / Badges: `text-[10px]` to `text-xs`, tracking `tracking-widest`

---

## Spacing & Layout

- **Max container width**: `1200px`
- **Section padding**: `py-20` (80px) mobile / `py-28` (112px) desktop
- **Horizontal padding**: `px-6`
- **Card spacing**: `gap-6`
- **Border radius**: `rounded-xl` (12px) for buttons, `rounded-2xl` (16px) for cards
- **Section rhythm**: Alternate dark (`black-main`) and light (`cream`) backgrounds

---

## Component Styles

### Primary Button (CTA)
- Background: `cyan` (`#00C2C7`)
- Text: `black-main`
- Padding: `px-7 py-3`
- Border radius: `rounded-xl`
- Hover: `bg-blue`, `shadow-glow`, `-translate-y-1`

### Secondary Button (Outline)
- Border: `border-cyan`
- Text: `cyan`
- Hover: `bg-cyan/10`

### Cards (Light sections)
- Background: `white`
- Shadow: `shadow-[0_10px_30px_rgba(0,0,0,0.06)]`
- Hover: `shadow-[0_15px_40px_rgba(0,0,0,0.1)]`, `-translate-y-2`
- Border radius: `rounded-2xl`
- Padding: `p-6` to `p-8`

### Trust Badges (Hero)
- Icon container: `w-10 h-10`, `bg-black-elevated`, `rounded-full`, `border border-white/10`
- Icon color: `cyan`
- Label: uppercase, `font-ui`, bold, `text-[10px]`

### Navbar
- Fixed position, `z-50`
- Background: `bg-black-main/90` + `backdrop-blur-md`
- Bottom border: `border-white/5`
- Height: `h-16` mobile / `h-20` desktop
- Logo: cyan dot + "Bimmer**Next**" in Bebas Neue

---

## Section Flow

1. **Navbar** — Fixed, always visible
2. **Hero** — Dark (`black-main`), BMW image background, gradient overlay, trust badges
3. **Brands Bar** — Dark (`black-soft`), BMW / MINI / Rolls-Royce logos
4. **Services** — Light (`cream`), 5-card grid
5. **Expertise** — Dark (`black-main`), image + text split
6. **Stats** — Light (`cream`), 4-column numbers
7. **Our Work** — Light (`cream`), 5-image gallery grid
8. **Testimonials** — White, 3 review cards
9. **CTA** — Dark (`black-main`), full-bleed background image
10. **Footer** — Dark (`black-main`), 4-column layout

---

## Imagery Direction

- **Hero**: Cinematic garage shot, mechanic working on BMW, dark/moody, high contrast
- **Expertise**: Professional mechanic portrait or workshop detail
- **Gallery**: High-quality BMW/MINI/Rolls-Royce photography, dramatic lighting
- **All images**: Desaturated, high contrast, cinematic feel, cool tones that complement cyan

---

## Animation & Motion

- **Button hover**: `transition-all duration-300`, `-translate-y-1`, color shift
- **Card hover**: `transition-all duration-300`, `-translate-y-2`, shadow increase
- **Gallery hover**: `transition-transform duration-500`, `scale-110`
- **Smooth scroll**: `html { scroll-behavior: smooth }`
- **Page load**: No heavy animations, content-first approach

---

## Voice & Tone

- **Direct**: "Stop Guessing. Bring It to the Specialists."
- **Confident**: "Dealer-Level Diagnostics. Real Expertise. No Guesswork."
- **Premium but approachable**: Technical precision without arrogance
- **Action-oriented**: Every section drives toward "Book Inspection" or "WhatsApp Us"

---

## Contact Details (Placeholder)
- Phone: `+971 50 123 4567`
- WhatsApp: `wa.me/971501234567`
- Email: `info@bimmernext.ae`
- Location: `Ajman, UAE`
- Hours: Mon-Sat 9:00 AM - 7:00 PM, Sun Closed

---

## Tech Stack
- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4
- shadcn/ui (base components only)
- Lucide React (icons)
- Google Fonts: Bebas Neue, Inter, Poppins
