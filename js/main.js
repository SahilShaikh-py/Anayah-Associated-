/**
 * ANAYAH ASSOCIATES — Main Application Entry Point
 * Orchestrates Lenis smooth scrolling, GSAP ScrollTrigger timeline,
 * preloader synchronization, and section animations.
 */

import { decodeText, initDecode } from './decode.js';
import { HeroController } from './hero.js';
import { ScrubSequence } from './scrub.js';
import { UIController } from './ui.js';

class App {
  constructor() {
    this.isReducedMotion = false; // Always provide full award-winning animation suite
    this.init();
  }

  async init() {
    // 1. GSAP & Lenis Registration
    this.initSmoothScroll();

    // 2. Preloader & Entrance Animation
    await this.runPreloader();

    // 3. Initialize Core Subsystems
    initDecode();
    this.hero = new HeroController();
    this.scrub = new ScrubSequence();
    this.ui = new UIController();

    // 4. Scroll-Triggered Section Animations
    this.initHeroScrollExit();
    this.initStoryTextScrub();
    this.initExpertiseSvgDraw();
    this.initProjectsHorizontalScroll();
    this.initScrollProgressBar();

    // Refresh layout calculations after everything renders
    setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 400);
  }

  initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false
    });

    window.lenis = lenis;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  runPreloader() {
    return new Promise((resolve) => {
      const preloader = document.getElementById('preloader');
      const counterEl = document.getElementById('preloader-counter');
      const visited = sessionStorage.getItem('anayah_visited');

      // If visited before, skip quickly
      if (visited && preloader) {
        preloader.style.display = 'none';
        this.playEntranceTimeline();
        resolve();
        return;
      }

      let progress = 0;
      let targetProgress = 0;
      let isDone = false;

      const finishLoader = () => {
        if (isDone) return;
        isDone = true;
        sessionStorage.setItem('anayah_visited', 'true');

        if (counterEl) counterEl.textContent = '100';

        // Split curtains animation
        if (preloader) {
          preloader.classList.add('is-revealing');
          setTimeout(() => {
            preloader.style.display = 'none';
            this.playEntranceTimeline();
            resolve();
          }, 650);
        } else {
          this.playEntranceTimeline();
          resolve();
        }
      };

      // Force-continue failsafe: never block longer than 3.5s
      const failsafe = setTimeout(finishLoader, 3500);

      // Track real asset milestones
      const updateTarget = (val) => {
        targetProgress = Math.max(targetProgress, val);
      };

      // Fonts
      if (document.fonts) {
        document.fonts.ready.then(() => updateTarget(35));
      } else {
        updateTarget(35);
      }

      // Hero video ready
      const video = document.getElementById('hero-video');
      if (video) {
        if (video.readyState >= 3) {
          updateTarget(70);
        } else {
          video.addEventListener('canplay', () => updateTarget(70), { once: true });
        }
      } else {
        updateTarget(70);
      }

      // First few scrub frames
      const checkInitialFrames = async () => {
        try {
          const isMobile = window.innerWidth <= 768;
          const basePath = isMobile ? 'assets/seq/mobile/f_' : 'assets/seq/desktop/f_';
          const promises = [1, 2, 4, 8, 16].map((idx) => {
            const p = String(idx).padStart(4, '0');
            const img = new Image();
            img.src = `${basePath}${p}.webp`;
            return img.decode().catch(() => {});
          });
          await Promise.all(promises);
          updateTarget(100);
        } catch (_) {
          updateTarget(100);
        }
      };
      checkInitialFrames();

      // Smooth number tick loop
      const tick = () => {
        if (progress < targetProgress) {
          progress += Math.ceil((targetProgress - progress) * 0.15) || 1;
          if (progress > 100) progress = 100;
          if (counterEl) {
            counterEl.textContent = String(progress).padStart(3, '0');
          }
        }

        if (progress >= 100) {
          clearTimeout(failsafe);
          setTimeout(finishLoader, 200);
        } else {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    });
  }

  playEntranceTimeline() {
    if (this.isReducedMotion) {
      document.body.classList.add('is-ready');
      return;
    }

    // Choreographed entrance sequence matching specification
    const frame = document.querySelector('.viewfinder-frame');
    const logo = document.querySelector('.masthead-logo');
    const navItems = document.querySelectorAll('.nav-link, .nav-btn');
    const h1Row1 = document.querySelector('.hero-h1-row-1 .hero-h1-inner');
    const h1Row2 = document.querySelector('.hero-h1-row-2 .hero-h1-inner');
    const rail = document.getElementById('hero-rail');
    const paragraph = document.getElementById('hero-paragraph');
    const ctas = document.querySelectorAll('.hero-cta-group .btn');
    const dock = document.getElementById('hero-dock');

    // 40ms: Frame lines draw
    setTimeout(() => {
      if (frame) frame.classList.add('is-active');
    }, 40);

    // 160ms: Logo mask reveal
    setTimeout(() => {
      if (logo) logo.classList.add('is-revealed');
    }, 160);

    // 340ms: Nav fade + label decode from 360ms
    setTimeout(() => {
      navItems.forEach((item, idx) => {
        setTimeout(() => {
          item.classList.add('is-revealed');
          const decodeTarget = item.querySelector('[data-decode]') || item;
          if (decodeTarget.hasAttribute('data-decode')) {
            decodeText(decodeTarget, { duration: 320 });
          }
        }, idx * 45);
      });
    }, 340);

    // 420ms: Headline Row 1
    setTimeout(() => {
      if (h1Row1) {
        h1Row1.style.transform = 'translateY(0)';
        h1Row1.style.opacity = '1';
      }
    }, 420);

    // 520ms: Headline Row 2
    setTimeout(() => {
      if (h1Row2) {
        h1Row2.style.transform = 'translateY(0)';
        h1Row2.style.opacity = '1';
      }
    }, 520);

    // 600ms: Index rail + active marker
    setTimeout(() => {
      if (rail) rail.classList.add('is-revealed');
    }, 600);

    // 700ms: Hero paragraph
    setTimeout(() => {
      if (paragraph) {
        paragraph.style.transform = 'translateY(0)';
        paragraph.style.opacity = '1';
      }
    }, 700);

    // 860ms: CTAs
    setTimeout(() => {
      ctas.forEach((btn) => btn.classList.add('is-revealed'));
    }, 860);

    // 920-1100ms: Hero dock
    setTimeout(() => {
      if (dock) dock.classList.add('is-revealed');
      document.body.classList.add('is-ready');
    }, 950);
  }

  initHeroScrollExit() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const hero = document.getElementById('hero');
    const videoWrap = document.querySelector('.hero-video-wrap');
    const heroContent = document.querySelector('.hero-content');
    if (!hero || !videoWrap) return;

    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        // Scale 1.08 -> 0.94
        const scale = 1.08 - p * 0.14;
        videoWrap.style.transform = `scale(${scale.toFixed(3)})`;
        // Chamfered clip-path tightening
        const clipInset = (p * 24).toFixed(1);
        videoWrap.style.clipPath = `polygon(${clipInset}px 0%, calc(100% - ${clipInset}px) 0%, 100% calc(100% - ${clipInset}px), calc(100% - ${clipInset}px) 100%, ${clipInset}px 100%, 0% calc(100% - ${clipInset}px))`;

        if (heroContent) {
          heroContent.style.opacity = `${(1 - p * 1.5).toFixed(2)}`;
          heroContent.style.transform = `translate3d(0, ${(-p * 60).toFixed(1)}px, 0)`;
        }
      }
    });
  }

  initStoryTextScrub() {
    const statement = document.getElementById('story-statement');
    if (!statement) return;

    // Split text into individual words
    const words = statement.textContent.trim().split(/\s+/);
    statement.innerHTML = '';
    words.forEach((w) => {
      const span = document.createElement('span');
      span.className = 'story-word';
      span.textContent = `${w} `;
      statement.appendChild(span);
    });

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const wordSpans = statement.querySelectorAll('.story-word');
    ScrollTrigger.create({
      trigger: statement,
      start: 'top 75%',
      end: 'bottom 45%',
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        const total = wordSpans.length;
        wordSpans.forEach((span, idx) => {
          const wordProg = idx / total;
          if (p >= wordProg) {
            span.style.opacity = '1';
            span.style.color = 'var(--ink)';
          } else {
            span.style.opacity = '0.15';
            span.style.color = 'var(--muted)';
          }
        });
      }
    });
  }

  initExpertiseSvgDraw() {
    const cards = document.querySelectorAll('.expertise-card');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          card.classList.add('is-inview');
          const paths = card.querySelectorAll('.sector-svg-icon path, .sector-svg-icon rect, .sector-svg-icon circle');
          paths.forEach((path) => {
            const length = path.getTotalLength ? path.getTotalLength() : 200;
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.getBoundingClientRect(); // reflow
            path.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
            path.style.strokeDashoffset = '0';
          });
          obs.unobserve(card);
        }
      });
    }, { threshold: 0.25 });

    cards.forEach((c) => observer.observe(c));
  }

  initProjectsHorizontalScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const section = document.getElementById('projects');
    const track = document.getElementById('projects-horizontal-track');
    if (!section || !track) return;

    // Apply horizontal pinning only on desktop >= 901px
    ScrollTrigger.matchMedia({
      '(min-width: 901px)': function () {
        const totalScroll = track.scrollWidth - window.innerWidth;
        if (totalScroll <= 0) return;

        gsap.to(track, {
          x: () => -totalScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 0.8,
            start: 'top top',
            end: () => `+=${totalScroll}`,
            invalidateOnRefresh: true
          }
        });
      },
      '(max-width: 900px)': function () {
        // Reset transform on mobile
        gsap.set(track, { clearProps: 'all' });
      }
    });
  }

  initScrollProgressBar() {
    const bar = document.getElementById('frame-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollH > 0 ? (window.scrollY / scrollH) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }, { passive: true });
  }
}

// Boot application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}
