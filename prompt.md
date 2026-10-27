You are a senior creative developer and award-level web designer (Awwwards / FWA standard). Build a complete, production-ready, multi-section, single-page website for a real construction company, ANAYAH ASSOCIATES. The site must feel like a premium architectural film you scroll through: cinematic video, a scroll-scrubbed construction sequence, decoding labels, masked headline reveals, mouse parallax, and buttery smooth scrolling — while staying fast, accessible and fully responsive.

Design an original visual identity. Do not copy any existing website's code, logo, SVG paths, copy or assets. Use only the facts given below; never invent clients, awards, testimonials, statistics or certifications. Where content is missing, insert a clearly marked placeholder (<!-- TODO: client to supply -->).

Deliver every file in full. No "…rest of code here", no omitted sections.

1. Client facts (the only source of truth)
Field	Value
Company	ANAYAH ASSOCIATES
Established	2018 (show as "Since 2018"; compute years of experience in JS from the current year, so it never goes stale: 2026 → "8+ years")
Sectors	Residential · Commercial · Industrial construction
Address	Anayah Associates, Sai Super Market, Main Road, Shrirampur, Tal-Shrirampur, Dist-Ahilyanagar, Maharashtra, India
Phone	+91 87887 31650 → tel:+918788731650
WhatsApp	https://wa.me/918788731650?text=Hello%20Anayah%20Associates%2C%20I%27d%20like%20to%20discuss%20a%20project.
Email	sameiirshaikh@gmail.com → mailto: with subject "Project Enquiry — Website"
Ongoing works	5 active sites
Featured completed projects

Residential — 12,000 sq ft residential building, Shrirampur. Client: Mr. Santosh Morge.
Commercial — Commercial building, Deolali Pravara. Client: Mr. Bashir Pathan.
Industrial & Community — Mangal Karyalay (marriage hall) and Cotton Seed Oil & Cotton Seed Cake industry, Jatap. Client: Sai Shaneshwar Farmer Producer Company.
Project photos are not supplied yet: use tasteful dark gradient placeholders with the sector icon and a TODO comment, sized so real photos drop in without layout change.

2. Tech stack & file structure
Plain HTML5 + CSS3 + vanilla ES modules. No React, no build step required.
GSAP 3.12.5 + ScrollTrigger and Lenis 1.1.x for smooth scroll — load from cdnjs.cloudflare.com / unpkg.com with exact pinned versions, plus a local copy fallback in assets/vendor/ so the site works offline.
Fonts self-hosted WOFF2 (font-display: swap, preload the two used above the fold):
Display/headlines: Inter Tight 700 (or Inter 700)
Body: Inter 400 / 500
Technical labels, nav, numbers: Chakra Petch 600/700
Works when served over HTTP (npx http-server . -p 8080 -c-1). Include a README.md with setup, asset commands and deploy steps (Netlify / Vercel / cPanel).
index.html
css/style.css
js/main.js            # boot, Lenis, GSAP registration
js/decode.js          # text-decode effect
js/hero.js            # chapter switcher + parallax
js/scrub.js           # scroll-scrubbed construction sequence (canvas)
js/ui.js              # menu, counters, magnetic buttons, cursor, form
assets/fonts/*.woff2
assets/video/hero.mp4           # looping hero film (H.264)
assets/video/hero-mobile.mp4    # 960px version
assets/img/poster.webp          # first frame, video poster
assets/img/poster-final.webp    # last frame (completed tower)
assets/seq/desktop/f_0001.webp …  # scroll-scrub frames
assets/seq/mobile/f_0001.webp …
assets/img/projects/*.webp      # placeholders until photos arrive
assets/img/og.jpg               # 1200×630 social preview
assets/vendor/gsap.min.js, ScrollTrigger.min.js, lenis.min.js
favicon.svg, site.webmanifest, robots.txt, sitemap.xml
2a. Asset preparation (the source film)
The source is one cinematic clip: a modern tower rising from empty land to a finished, glowing building, with wireframe/blueprint overlays — Tower_4K_60fps_enhanced.mp4 (≈10 s). Put the exact ffmpeg commands in the README:

# hero loop, desktop + mobile (H.264, no audio, fast start)
ffmpeg -i Tower_4K_60fps_enhanced.mp4 -an -vf "fps=30,scale=1920:-2:flags=lanczos" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart assets/video/hero.mp4
ffmpeg -i Tower_4K_60fps_enhanced.mp4 -an -vf "fps=30,scale=960:-2:flags=lanczos"  -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart assets/video/hero-mobile.mp4

# posters: first frame (empty land) and last frame (finished tower)
ffmpeg -i Tower_4K_60fps_enhanced.mp4 -frames:v 1 -vf "scale=1920:-2" -q:v 80 assets/img/poster.webp
ffmpeg -sseof -0.1 -i Tower_4K_60fps_enhanced.mp4 -frames:v 1 -vf "scale=1920:-2" -q:v 80 assets/img/poster-final.webp

# scroll-scrub image sequence (24 fps ≈ 240 frames)
ffmpeg -i Tower_4K_60fps_enhanced.mp4 -vf "fps=24,scale=1600:-2:flags=lanczos" -c:v libwebp -quality 70 assets/seq/desktop/f_%04d.webp
ffmpeg -i Tower_4K_60fps_enhanced.mp4 -vf "fps=24,scale=900:-2:flags=lanczos"  -c:v libwebp -quality 65 assets/seq/mobile/f_%04d.webp
Write FRAME_COUNT into scrub.js from the actual number of generated frames (document how to check: ls assets/seq/desktop | wc -l).

3. Design system
:root{
  /* 1 unit = 1px on a 1440×900 reference, scales with the viewport */
  --u: clamp(0.7px, min(100vw / 1440, 100dvh / 900), 1.6px);
  --bg: #05080e;          /* night navy-black */
  --bg-2: #0b111b;
  --ink: #f2f4f8;
  --muted: rgba(226,232,244,.66);
  --line: rgba(255,255,255,.12);
  --accent: #e9b872;      /* warm site-light / sodium amber, from the tower's glow */
  --accent-2: #6fd3ff;    /* blueprint wireframe cyan, used sparingly */
  --cream: #ecdcd2;
  --e-mask: cubic-bezier(.16,1,.3,1);
  --e-line: cubic-bezier(.65,0,.35,1);
  --e-soft: cubic-bezier(.22,.61,.36,1);
}
Dark, architectural, restrained. Amber = warmth/human; cyan = engineering/blueprint (only for wireframe details, grid lines, the scrub progress).
Blueprint grid texture: a faint 1px grid (every 80u) in rgba(111,211,255,.035) behind non-video sections, plus a subtle film-grain overlay (CSS/SVG noise, 4% opacity, pointer-events:none).
Frame: fixed 1px hairline frame, inset 28u, with 22u chamfered (cut) corners drawn with linear-gradient diagonals — stays visible over the whole site like a viewfinder.
Chamfered components: buttons, cards and the menu panel use clip-path octagon chamfers (10u cut) with an SVG outline stroke — the signature shape of the brand.
Type scale (desktop, in --u): H1 64/64 uppercase, letter-spacing 1.5; H2 44/48; labels 11 uppercase Chakra, tracking 1.4; body 16/27 (never below 15px on mobile).
Wordmark: build an original text-based logo "ANAYAH ASSOCIATES" (Chakra Petch 700, wide tracking) with a small geometric mark — a chamfered square containing a stylised "A" formed like a building section. Inline SVG, fill: currentColor.
4. Page sections (in order)
0 · Preloader (≤ 1.6 s, skipped on repeat visits via sessionStorage)
Black screen, blueprint grid draws in, a counter 000 → 100 in Chakra tracks real asset loading (hero video canplay + first 20 scrub frames + fonts), the wordmark rises through a mask, then the loader splits horizontally (two panels slide up/down) to reveal the hero. Never block longer than 4 s — force-continue.

1 · Hero — "Chapters" film (full viewport, pinned)
hero.mp4 loops behind everything (muted autoplay loop playsinline, poster = poster.webp), sized to cover with a 1.08 scale so parallax never exposes edges. Swap to hero-mobile.mp4 at ≤ 768px via <source media> or JS.
Bottom gradient for legibility: linear-gradient(to top, rgba(5,8,14,.85), transparent 55%).
Left index rail (vertical, centred): VISION · EXPRESSION · CRAFTSMANSHIP · REFINEMENT · BALANCE · ORIGIN. Active item white with a 6×7u marker; inactive 30% opacity. Auto-advances every 7 s (pauses on hover/focus, stops after user interaction), with a thin progress line under the active item.
Chapters map to segments of the same film (there is only one clip): clicking a chapter fades a black veil (0.35 s), seeks the video to that chapter's start time, fades back. Segments: VISION 0.0s, EXPRESSION 1.7s, CRAFTSMANSHIP 3.4s, REFINEMENT 5.0s, BALANCE 6.7s, ORIGIN 8.3s (make these constants easy to edit). If separate per-chapter clips are added later to assets/video/<id>.mp4, the code should prefer them automatically (lazy data-src, crossfade 0.9 s).
Copy per chapter (headline 2 lines, paragraph):
Chapter	Headline	Paragraph
VISION	BUILDING EXCELLENCE / SINCE 2018	Anayah Associates delivers precision construction across residential, commercial and industrial developments in Ahilyanagar — from the first blueprint to a finished, lasting structure.
EXPRESSION	ARCHITECTURE WITH / PURPOSE AND FORM	Every structure we build is shaped by its site, its climate and the people who will use it every day.
CRAFTSMANSHIP	BUILT WITH PRECISION, / ENGINEERED TO LAST	Our teams supervise every footing, column and finish — from foundation work to final handover.
REFINEMENT	PLANNED IN DETAIL, / EXECUTED WITH CARE	Every layout goes through careful planning and multi-stage review before a single wall rises.
BALANCE	SCALE THAT SERVES / THE COMMUNITY	Homes, businesses and industry designed to be practical, viable and good for the region around them.
ORIGIN	ROOTED IN SHRIRAMPUR, / TRUSTED ACROSS THE REGION	Founded in Shrirampur in 2018 on one belief: reliable construction builds lasting communities.
Swap animation: headline rows drop into their overflow mask (translateY(112%), 0.5 s --e-mask), paragraph fades + drops 8u, text swaps, both rise back. Rapid clicks: newest choice always wins.
CTAs: primary "START YOUR PROJECT" (amber chamfered button → scrolls to Contact) and secondary "VIEW OUR WORK" (glass chamfered button → Projects).
Mouse parallax: video layer drifts against the pointer (lerp 0.045/frame, max offset 1.6% W / 1.5% H, auto-compensating scale), headline drifts the opposite way at 30% of that — depth. rAF loop sleeps when settled. Mouse only; off for touch and reduced motion.
Scroll exit: as the user scrolls past the hero, the video scales 1 → 0.92 with a chamfered clip-path closing in, and the copy fades up — a "camera pulling back" handoff to the next section.
2 · Masthead (fixed)
Logo top-left. Right: nav STORY · EXPERTISE · PROJECTS · PROCESS · CONTACT, a glass "CALL NOW" pill (tel:), and a cream chamfered MENU pill. Hide on scroll down, reveal on scroll up (after hero). Active section highlighted via ScrollTrigger. ≤ 900px: links collapse into a full-screen menu overlay (blueprint grid background, large staggered links, contact details at the bottom, Escape/outside-click to close, focus trap, label decodes MENU ↔ CLOSE).

3 · THE BUILD — scroll-scrubbed construction sequence (the showpiece)
Section height 500vh, inner stage pinned (ScrollTrigger pin, scrub: 0.6).
A full-bleed <canvas> draws the image sequence: scroll progress 0→1 maps to frame 1→FRAME_COUNT. The tower literally rises from empty land to a finished glowing building as the user scrolls.
Implementation requirements (critical for smoothness):
Draw with drawImage using cover-fit math; handle devicePixelRatio (cap at 2); redraw on resize.
Progressive loading: load every 8th frame first, then every 4th, then 2nd, then all; while a frame isn't loaded, draw the nearest loaded one. Use img.decode(); keep decoded ImageBitmaps when supported.
Choose desktop or mobile sequence by viewport width and navigator.connection.saveData.
Only render inside rAF when the frame index changes. Release work when the section is off-screen.
Fallback (reduced motion, or sequence fails to load): show poster-final.webp with the stage captions as a normal static list.
Four stage captions synchronised with progress, each entering from a mask on the left with a decode-label number:
Progress	Label	Title	Line
0–0.22	01 / SITE & SURVEY	From empty land	Soil testing, survey and site planning before anything is built.
0.22–0.48	02 / FOUNDATION & FRAME	Strength below, structure above	RCC foundation, columns and slabs, inspected at every stage.
0.48–0.76	03 / ENVELOPE & SERVICES	Walls, glass and systems	Masonry, facade, electrical and plumbing coordinated as one.
0.76–1	04 / FINISH & HANDOVER	A building ready for life	Final finishes, quality checks and on-time handover.
HUD overlay (engineering feel, Chakra, cyan accents): left a vertical progress rail with 4 ticks; bottom-right a live readout FLOOR 00 → 12, PROGRESS 000%, and coordinates 19.62°N 74.66°E (Shrirampur); thin animated wireframe corner brackets around the canvas. All numbers tick with progress.
Subtle vignette and a slow scale 1.0 → 1.06 across the whole scrub for camera depth.
4 · STORY — About
Large statement, revealed word-by-word as you scroll (each word goes from 15% to 100% opacity with scroll scrub): "Since 2018, Anayah Associates has turned plans into places across Ahilyanagar — homes, businesses and industry built to last."
Counters (count up once on enter, Chakra numbers, amber unit): {years}+ YEARS (computed from 2018) · 3 SECTORS · 3 FEATURED LANDMARK PROJECTS · 5 SITES UNDER CONSTRUCTION. Do not add any other statistics.
Split layout with poster-final.webp in a chamfered frame that reveals with a clip-path wipe and has inner parallax.
5 · EXPERTISE — three sectors
Three tall chamfered cards: RESIDENTIAL · COMMERCIAL · INDUSTRIAL, each with an original line-art SVG icon that draws itself (stroke-dashoffset) on enter, a one-line description, and an example from the featured list. Hover: card lifts 6u, outline brightens, a cyan scan-line sweeps once, 3D tilt ±4° following the cursor (desktop only).

6 · PROJECTS — featured works
Desktop: horizontal scroll section (pinned; vertical scroll moves a track of 3 large project panels + a final "Your project next →" panel).
Each panel: sector tag, project title, location, client, scope (e.g., "12,000 sq ft"), image placeholder with hover zoom and a parallax inner image, and a large outlined index number 01–03.
Mobile: vertical stack with swipe-friendly cards (no horizontal pin).
Clicking a panel opens an accessible modal (dialog element) with the project details and a placeholder gallery.
7 · ONGOING — live sites
A band showing "5 projects currently under construction across the region", a pulsing amber "LIVE" dot, and an infinite marquee of sector words (RESIDENTIAL · COMMERCIAL · INDUSTRIAL · COMMUNITY ·) whose speed and direction react to scroll velocity. Do not list fake site names.

8 · PROCESS — how we work
Vertical timeline whose spine line draws with scroll: 01 Consultation → 02 Site survey & planning → 03 Design & approvals → 04 Construction → 05 Quality inspection → 06 Handover & support. Each step's node fills amber as the line passes it.

9 · WHY ANAYAH
Four concise pillars (Transparent costing · Quality supervision on site · On-time delivery · Local expertise in Ahilyanagar) — phrased as commitments, not as claims with numbers.

10 · CONTACT
Big headline "LET'S BUILD SOMETHING THAT LASTS." with masked reveal.
Contact cards: Address (with "Open in Google Maps" link using a https://www.google.com/maps/search/?api=1&query= URL for the address), Phone, WhatsApp, Email — each with a copy-to-clipboard button and toast.
Enquiry form: Name, Phone, Project type (Residential / Commercial / Industrial / Other), Location, Message. Client-side validation (Indian 10-digit phone). On submit, no backend: build a pre-filled WhatsApp message from the fields and open wa.me, with a secondary "Send by email" that builds a mailto:. Clearly comment where a real form endpoint (Formspree / Netlify Forms) can be plugged in.
Optional lazy-loaded Google Maps embed behind a "Load map" button (no third-party requests until clicked).
11 · Footer
Wordmark, short line "Residential · Commercial · Industrial Construction — Since 2018", quick links, contact, © {current year} Anayah Associates, and a "Back to top" chamfered button that scrolls smoothly with Lenis.

Persistent UI
Floating WhatsApp button bottom-right (chamfered, amber glow pulse every 6 s, hides inside Contact section).
Dock at the bottom of the hero only: AUDIO toggle (UI state only unless assets/audio/ambient.mp3 exists — then play/pause it, default OFF, fade volume), "SCROLL TO EXPLORE" with animated double chevron, and "CALL +91 87887 31650".
Custom cursor (desktop, fine pointer only): small dot + lagging ring; ring grows with a label ("VIEW", "DRAG", "PLAY") over interactive zones. Respect prefers-reduced-motion and touch devices (disable).
Magnetic buttons: primary CTAs pull toward the cursor up to 8u.
Scroll progress hairline across the top of the frame in amber.
5. Motion language (must be consistent everywhere)
DRAW — hairlines and frames scale from their anchor (--e-line, 0.5 s).
MASK — headlines rise out of overflow-hidden rows (translateY(112%) → 0, 0.9 s --e-mask, 100 ms stagger per row).
DECODE — every uppercase label resolves left-to-right in exactly 400 ms regardless of length: resolved characters followed by a 3–4 char band of random A–Z letters re-rolled every 45 ms, nothing beyond the band. Reserve each label's width first so nothing reflows. Runs on load, on section enter, and on hover of any link/button. Force-settle after duration + 500 ms.
SETTLE — supporting elements fade up 8u (--e-soft, 0.6 s).
SCRUB — anything tied to scroll uses ScrollTrigger scrub (0.6–1), never time-based tweens.
Entrance timeline after preloader (ms): frame lines draw 40 → logo mask 160 → nav fade 340 + label decode from 360 (45 ms stagger) → headline row 1 at 420, row 2 at 520 → index rail 600, active marker 640 → paragraph 700 → CTAs 860 → dock 920–1100. Nothing animates after ~1.6 s except video, hover, parallax and scroll-driven motion.

Lenis settings: lerp: 0.085, smoothWheel: true, synced to GSAP ticker (lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)). Disable Lenis for reduced motion. Anchor links scroll through Lenis with offset for the masthead.

6. Responsive rules
Breakpoints: ≥1440 large · 1152 laptop/tablet landscape · 900 nav collapse · 768 tablet portrait (mobile video + sequence) · 548 phone · 370 small phone.
Phones: hero headline wraps with text-wrap: balance and fades as one block; index rail becomes a horizontal, scrollable chip row under the masthead; THE BUILD section height 350vh with captions as a bottom sheet; Projects become a vertical stack; frame inset 16u.
Short screens (height ≤ 560px): hide hero paragraph, keep CTAs.
Use 100dvh with 100vh fallback. No horizontal overflow at any width (test 320px).
Touch targets ≥ 44px.
7. Performance budget
Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100.
LCP element = hero poster image (preload it, fetchpriority="high"). CLS < 0.05.
Initial JS ≤ 120 KB gzipped (excluding image sequence). Scrub frames load only after the hero is interactive and progressively (see section 4·3).
Lazy-load everything below the fold (loading="lazy", decoding="async"); pause the hero video when out of view (IntersectionObserver) and when the tab is hidden.
will-change only during active animation. No layout thrashing: read then write.
8. Accessibility
Semantic landmarks (header, nav, main, section with aria-labelledby, footer), one h1.
Skip link "Skip to content". Visible focus ring: 1.5u solid --cream, offset 3u.
Videos aria-hidden="true"; the hero has a text alternative describing the tower rising.
Decode effect: keep the real text in aria-label so screen readers never hear scrambled letters.
prefers-reduced-motion: reduce: no preloader animation, no decode, no parallax, no Lenis, no scrub (static fallbacks), instant chapter swaps.
Colour contrast AA for all text over video (use the gradient overlay).
Menu and modal: focus trap, Escape closes, focus returns to trigger.
9. SEO & sharing
<title>: "Anayah Associates — Construction Company in Shrirampur, Ahilyanagar | Since 2018"
Meta description: "Anayah Associates builds residential, commercial and industrial projects in Shrirampur and Ahilyanagar since 2018. Call +91 87887 31650."
Open Graph + Twitter card with og.jpg; canonical URL placeholder.
JSON-LD GeneralContractor (LocalBusiness) with name, address, telephone, email, foundingDate: "2018", areaServed: "Ahilyanagar, Maharashtra", and geo placeholder.
sitemap.xml, robots.txt, site.webmanifest, SVG favicon from the logo mark, theme-color: #05080e.
lang="en"; structure copy so a Marathi version (lang="mr") can be added later via a simple JSON dictionary (implement the toggle only as an optional, commented-out stub).
10. Code quality
Clean, commented, modular; no inline event handlers; CSS uses custom properties and logical sections; JS uses const/let, small pure functions, matchMedia listeners, and cleans up ScrollTriggers on resize (ScrollTrigger.refresh() after fonts and images load).
No console errors or warnings. No external requests at runtime except the pinned CDN scripts (with local fallback) and links the user clicks.
Test notes in README: Chrome, Safari (iOS: playsinline, autoplay muted), Firefox, Edge; widths 320, 375, 768, 1024, 1280, 1440, 1920.
11. Acceptance checklist (verify before you finish)
 Preloader → hero entrance plays once, ends by ~1.6 s.
 Hero video autoplays muted on desktop and iPhone; chapters switch copy + film segment; rapid clicks end on the last choice.
 THE BUILD: scrolling scrubs the tower from empty land to finished building smoothly at 60 fps on a mid-range laptop, with captions and HUD in sync; reverse scrolling works.
 Projects horizontal scroll on desktop, vertical on mobile.
 All phone, WhatsApp, email and map links work and use the exact client details.
 Only the client facts above appear — no invented numbers, names or testimonials.
 Reduced-motion mode is fully usable.
 No horizontal scroll at 320px; Lighthouse targets met.
Now output every file completely, starting with index.html, then css/style.css, each JS file, README.md, and the small config files.