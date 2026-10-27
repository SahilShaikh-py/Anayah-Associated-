# ANAYAH ASSOCIATES — Architectural & Civil Engineering Website

A production-ready, award-level single-page website for **ANAYAH ASSOCIATES**, a premier architecture, structural engineering, and construction firm established in 2018 in Shrirampur, Ahilyanagar, Maharashtra. Led by Principal Structural Consultant **Er. Sameer Subhedar Shaikh**.

Engineered with high-tech architectural aesthetics: continuous 280-frame skyscraper time-lapse background video, scroll-scrubbed 280-frame construction sequence on HTML5 canvas, decoding technical labels, masked headline reveals, interactive portfolio filters, and smooth Lenis scrolling.

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
| **Company** | ANAYAH ASSOCIATES |
| **Founder & Principal Consultant** | **Er. Sameer Subhedar Shaikh** |
| **Established** | 2018 (Dynamically computed in JS as `{currentYear - 2018}+ years`, e.g., 8+ years) |
| **Core Services** | **BPMS Tracing** · **3D Elevations** · **RC Structural Design** · **Turnkey Construction** |
| **Sectors** | Residential Villas · Commercial & Hotels · Heavy Industrial & Community Landmarks |
| **Office Address** | Anayah Associates, Sai Super Market, Main Road, Shrirampur, Tal-Shrirampur, Dist-Ahilyanagar, Maharashtra, India (413709) |
| **Phone** | `+91 87887 31650` (`tel:+918788731650`) |
| **WhatsApp** | `https://wa.me/918788731650` |
| **Email** | `sameiirshaikh@gmail.com` |
| **Active Sites** | 5 active sites currently under construction across the region |
| **Featured Projects** | Pathan Commercial Complex (Deolali Pravara), Sai Shaneshwar Mangal Karyalay & Seed Oil Plant (Jatap), Hotel Ganraj, Proposed Mangalmurti Residency, Aasif Bhai Residence (Islampura), Gadhe Duplex Bungalow, Dafal Saheb Residence, Twin Bungalows (Rahuri), Sonawane Row House Project, Jama Masjid Deolali Pravara |

---

## 3. Asset Preparation & Pipeline (Source Film)

The source film is `Assests/Anayah Association .mp4` (4K 60fps). The following commands generate all production-optimized assets:

### A. Hero Loop & Posters
```bash
# Desktop Hero Loop (1080p, H.264, no audio, faststart)
ffmpeg -i "Assests/Anayah Association .mp4" -an -vf "fps=30,scale=1920:-2:flags=lanczos" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart assets/video/hero.mp4

# Mobile Hero Loop (960px width)
ffmpeg -i "Assests/Anayah Association .mp4" -an -vf "fps=30,scale=960:-2:flags=lanczos" -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart assets/video/hero-mobile.mp4

# First frame (empty land) & Last frame (finished tower) posters
ffmpeg -i "Assests/Anayah Association .mp4" -frames:v 1 -vf "scale=1920:-2" -q:v 80 assets/img/poster.webp
ffmpeg -sseof -0.2 -i "Assests/Anayah Association .mp4" -frames:v 1 -vf "scale=1920:-2" -q:v 80 assets/img/poster-final.webp
```

### B. Scroll-Scrub Image Sequences (24 fps ≈ 238 frames)
```bash
# Desktop sequence (1600px width WebP)
ffmpeg -i "Assests/Anayah Association .mp4" -vf "fps=24,scale=1600:-2:flags=lanczos" -c:v libwebp -quality 70 assets/seq/desktop/f_%04d.webp

# Mobile sequence (900px width WebP)
ffmpeg -i "Assests/Anayah Association .mp4" -vf "fps=24,scale=900:-2:flags=lanczos" -c:v libwebp -quality 65 assets/seq/mobile/f_%04d.webp
```

### C. Verify Frame Counts
```bash
# Verify actual number of generated frames:
# On Windows PowerShell:
(Get-ChildItem assets/seq/desktop).Count
(Get-ChildItem assets/seq/mobile).Count

# On Unix / Linux:
ls assets/seq/desktop | wc -l
```
> **Note:** The exact generated frame count (`238`) is codified into `js/scrub.js` as `export const FRAME_COUNT = 238;`.

---

## 4. File Architecture

```text
├── index.html                   # Semantic markup, meta tags, JSON-LD, sections 0-11
├── favicon.svg                  # Architectural chamfered vector icon
├── site.webmanifest             # PWA web manifest
├── robots.txt                   # Search engine crawl rules
├── sitemap.xml                  # XML sitemap
├── README.md                    # Setup, commands & deployment documentation
├── css/
│   └── style.css                # Fluid typography (--u), chamfer tokens, animations
├── js/
│   ├── main.js                  # App bootstrap, Lenis smooth scroll, entrance timeline
│   ├── decode.js                # Glitch/text decode effect with fixed width lock
│   ├── hero.js                  # Video chapters, veil crossfade, mouse parallax
│   ├── scrub.js                 # HTML5 Canvas 238-frame scrub sequence with HUD
│   └── ui.js                    # Dynamic years, counters, cursor, modal, form
└── assets/
    ├── fonts/                   # Self-hosted WOFF2 fonts
    │   ├── Inter-400.woff2
    │   ├── Inter-500.woff2
    │   ├── Inter-700.woff2
    │   ├── ChakraPetch-600.woff2
    │   └── ChakraPetch-700.woff2
    ├── vendor/                  # Pinned offline fallback vendor scripts
    │   ├── gsap.min.js (3.12.5)
    │   ├── ScrollTrigger.min.js (3.12.5)
    │   └── lenis.min.js (1.1.18)
    ├── video/
    │   ├── hero.mp4             # 1080p 30fps faststart
    │   └── hero-mobile.mp4      # 960px 30fps faststart
    ├── img/
    │   ├── logo-full.png        # Transparent stacked emblem + wordmark
    │   ├── logo-mark.png        # Transparent architectural A emblem
    │   ├── logo-nav.png         # Transparent horizontal lockup
    │   ├── poster.webp          # Initial empty land frame
    │   ├── poster-final.webp    # Completed tower frame
    │   ├── og.jpg               # 1200x630 social preview card
    │   └── projects/            # 16:10 architectural placeholder graphics
    │       ├── residential-shrirampur.webp
    │       ├── commercial-deolali.webp
    │       ├── industrial-jatap.webp
    │       └── next-project.webp
    ├── seq/
    │   ├── desktop/f_0001.webp … f_0238.webp
    │   └── mobile/f_0001.webp … f_0238.webp
    └── audio/
        └── ambient.mp3          # Subtle architectural ambient tone
```

---

## 5. Deployment Guide

### Netlify
1. Create a `_headers` or configure Netlify to cache static assets:
   ```text
   /assets/*
     Cache-Control: public, max-age=31536000, immutable
   ```
2. Deploy the root folder directly via Git or drag-and-drop to Netlify Drop.
3. Publish directory: `.` (leave build command empty).

### Vercel
1. Run `vercel` in the project root.
2. Select default settings (Other framework, output directory `.`).
3. Deploy directly.

### cPanel / Apache / Nginx
1. Upload all files into `public_html`.
2. Ensure MIME types for `.woff2` (`font/woff2`) and `.webp` (`image/webp`) are enabled.
3. For Apache, enable `mod_deflate` and `mod_expires`.

---

## 6. Form Endpoint Integration

The contact form currently validates user inputs client-side (including 10-digit Indian mobile validation) and opens a pre-filled WhatsApp conversation on `wa.me`, with a fallback to `mailto:`.

To connect to **Formspree** or **Netlify Forms**, edit `js/ui.js` inside `initContactActions()`:

```javascript
await fetch("https://formspree.io/f/YOUR_FORM_ID", {
  method: "POST",
  body: new FormData(form),
  headers: { 'Accept': 'application/json' }
});
```

---

## 7. Browser & Resolution Testing Matrix

Tested and verified on:
- **Browsers:** Google Chrome, Safari (macOS & iOS `playsinline`), Mozilla Firefox, Microsoft Edge.
- **Responsive Widths:** 320px, 375px, 768px, 1024px, 1280px, 1440px, 1920px (Zero horizontal overflow).
- **Accessibility:** Semantic HTML5 landmarks, visible focus rings, keyboard accessible modal (`<dialog>`), WCAG AA contrast, and complete `prefers-reduced-motion` fallbacks.
