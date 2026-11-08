# ANAYAH ASSOCIATES — Luxury Real Estate & Architectural Landmarks

A production-ready, award-level single-page landing page for **ANAYAH ASSOCIATES**, a premier architecture, structural engineering, and luxury property development practice established in 2018 in Shrirampur, Ahilyanagar, Maharashtra. Directed by Founder and Principal Structural Consultant **Er. Sameer Subhedar Shaikh**.

Engineered with architectural minimalist editorial aesthetics: full-bleed 100vh master 4K/8K renders with camera-glide zoom, 280-frame scroll-scrubbed construction sequence on HTML5 canvas, delicate champagne gold line reveals, interactive hotspot architectural annotations, count-up landmark metrics, neighborhood transit vector links, and a high-conversion VIP viewing reservation suite with date picker and direct WhatsApp dispatch.

---

## 1. Quick Start & Local Serving

The project is built with plain **HTML5 + CSS3 + vanilla ES modules**. No build step or bundler is required.

Serve the root directory over any local HTTP server:

```bash
# Option A: Node http-server (Recommended)
npx http-server . -p 8080 -c-1

# Option B: Python 3 built-in HTTP server
python -m http.server 8080
```

Open your browser at `http://localhost:8080`.

---

## 2. Client & Firm Facts (Source of Truth)

| Field | Detail |
|---|---|
| **Company** | ANAYAH ASSOCIATES (Estates & Architecture) |
| **Founder & Principal Consultant** | **Er. Sameer Subhedar Shaikh** |
| **Established** | 2018 (Dynamically computed in JS as `{currentYear - 2018}+ years`, e.g., 8+ years) |
| **Core Capabilities** | **Bespoke Luxury Residences** · **BPMS Tracing** · **3D Elevations** · **IS-Code RC Structural Engineering** |
| **Sectors** | Luxury Residential Villas · Commercial & Hotels · Heavy Agro-Industrial & Community Landmarks |
| **Flagship Scale** | **12,000+ Sq. Ft. Flagship Estate** (Santosh Morge Luxury Estate, Shrirampur) |
| **Office Address** | Anayah Associates, Sai Super Market, Main Road, Shrirampur, Tal-Shrirampur, Dist-Ahilyanagar, Maharashtra 413709 |
| **Direct Phone** | `+91 87887 31650` (`tel:+918788731650`) |
| **WhatsApp Direct** | `https://wa.me/918788731650` |
| **Email** | `sameiirshaikh@gmail.com` |
| **Active Sites** | 5 active sites currently under regular on-site engineering supervision across Maharashtra |
| **Featured Projects** | Pathan Commercial Complex (Deolali Pravara), Sai Shaneshwar Mangal Karyalay & Seed Oil Plant (Jatap), Hotel Ganraj Highway Landmark, Proposed Mangalmurti Residency, Aasif Bhai Residence (Islampura), Gadhe Duplex Bungalow, Dafal Saheb Residence, Twin Bungalows (Rahuri), Sonawane Row House Project, Jama Masjid Deolali Pravara, Pilghar Executive Villa, Kalhapure Modern Residence, Daulatpur Bungalow, Anayah Signature Villa |

---

## 3. High-Resolution Architectural Renders & Scrollytelling Sequence

### A. Full-Bleed Hero Master Render (4K/8K UHD)
- The hero section uses master high-resolution renders (`assets/img/hero-chapters/chapter-6.webp`, `chapter-1.webp` through `chapter-6.webp`) upscaled with Lanczos filtering.
- As the user scrolls, a slow, subtle camera-glide zoom (`scale 1.0 to 1.08 over scroll progress`) provides cinematic architectural depth.
- Floating serif title with a delicate champagne gold line reveal (`scaleX: 0 -> 1`).
- Interactive Chapter / Vantage Switcher allows instant review of 6 architectural angles (Master Vision, BPMS Sanctions, 3D Elevations, RC Structural Core, Precision Execution, Completed Landmark).

### B. 4-Stage Scrollytelling Architecture
1. **Section 1: The Vision & Exterior Architecture (`#the-build`)**: Pinned 480vh container where scrolling scrubs through 280 high-definition frames on HTML5 canvas with cover-fit math, live floor counter (`FLOOR 00` -> `FLOOR 24`), progress readout (`000%` -> `100%`), and coordinates (`19.62°N 74.66°E Shrirampur`).
2. **Section 2: The Living Space & Signature Amenities (`#amenities`)**: Interactive elevation render with 4 clickable/hoverable hotspot pins revealing architectural specifications:
   - `01`: 7.2m Double-Height Clerestory Volumes & Low-E Glazing
   - `02`: Hand-Selected Italian Statuario Marble & Honed Travertine Masonry
   - `03`: Private Cantilevered Sky Courtyards & Sunken Lounge Terraces
   - `04`: IS-1893 Seismic-Resistant RC Core & Integrated Smart Automation
3. **Section 3: Key Metrics & Landmark Manifesto (`#story`)**: Word-by-word scroll-scrubbed text reveal (`0.15` -> `1.0` opacity) paired with animated count-up counters (12,000+ Sq. Ft., 150+ Structures, 8+ Years, 100% BPMS Clearance).
4. **Section 4: Location & Neighborhood Connectivity (`#neighborhood`)**: Split-screen panel with fine vector line connections showing transit times (Sai Super Market 0 mins, Central Railway 5 mins, Shirdi International Airport 35 mins, Pune-Nashik Corridor 45 mins) and an on-demand interactive Google Maps embed.

---

## 4. File Architecture

```text
├── index.html                   # High-end luxury real estate landing page
├── favicon.svg                  # Architectural monogram favicon
├── site.webmanifest             # PWA web manifest
├── robots.txt                   # Search engine crawl directives
├── sitemap.xml                  # XML sitemap
├── README.md                    # System architecture & deployment documentation
├── css/
│   └── style.css                # Fluid typography (--u), luxury palette, glassmorphism, responsive breakpoints
├── js/
│   ├── main.js                  # App bootstrap, Lenis smooth scroll, entrance timeline, camera-glide zoom
│   ├── decode.js                # Glitch/text decode effect with fixed width lock & aria-label
│   ├── hero.js                  # Master render crossfades, vantage switcher, mouse parallax
│   ├── scrub.js                 # HTML5 Canvas 280-frame scrub sequence with HUD telemetry
│   └── ui.js                    # Navigation, formatted count-up, 3D tilt, date picker, WhatsApp reservation
├── assets/
│   ├── fonts/                   # Self-hosted Inter (400, 500, 700) & Chakra Petch (600, 700) WOFF2
│   ├── img/
│   │   ├── hero-chapters/       # 6 High-resolution 3K/4K WebP master chapter frames
│   │   ├── projects/            # 17 Real client landmark WebP renders
│   │   ├── engineer-sameer-shaikh.webp # Founder & Principal Consultant portrait
│   │   ├── logo-full.png & logo-nav.png # Brand logos
│   │   └── poster-final.webp    # High-resolution architectural tower completed view
│   ├── seq/
│   │   ├── desktop/             # 280 high-resolution WebP frames (1600px width)
│   │   └── mobile/              # 280 mobile-optimized WebP frames (900px width)
│   ├── audio/
│   │   └── ambient.mp3          # Optional ambient architectural soundscape
│   └── vendor/
│       ├── gsap.min.js          # Pinned GSAP 3.12.5 library
│       ├── ScrollTrigger.min.js # Pinned ScrollTrigger 3.12.5 plugin
│       └── lenis.min.js         # Pinned Lenis 1.1.x smooth scroll
```

---

## 5. Responsive Testing & Viewport Verification

The website has been architected and verified across all target viewports:

| Viewport | Target Device | Layout Behaviour |
|---|---|---|
| **≥ 1440px** | Large Displays / 4K Monitors | Full editorial grid, master vantage rail, 4-column metric counters, interactive hotspots |
| **1152px – 1439px**| Laptops & Tablet Landscape | Fluid clamp scaling (`--u`), 2-column counters, split-screen neighborhood |
| **901px – 1151px** | Tablets Landscape | Pinned horizontal scroll, 2-column service cards, full desktop nav |
| **769px – 900px** | Tablet Portrait | Mobile menu pill, single-column story split & neighborhood layout |
| **376px – 768px** | Standard Smartphones | Native touch scrolling, vertical portfolio stack, full-screen mobile menu |
| **≤ 375px** | Compact Smartphones (iPhone SE, etc.) | Clamped 28px serif headlines, stacked CTAs, zero horizontal overflow |

---

## 6. Accessibility & Performance Compliance

- **Zero Scroll-Hijacking**: Native scrolling serves as the base, perfectly synchronized with touch, keyboard, trackpad, and anchor links.
- **`prefers-reduced-motion`**: Complete accessible fallback disabling heavy scrub animations, displaying static high-res renders, and eliminating motion jitter.
- **Screen Reader Support**: All text decode animations preserve real semantic text in `aria-label`.
- **Keyboard Navigation**: Interactive hotspots, modal dialogs, and mobile menu feature full Escape-key dismissal and tab focus trapping.
