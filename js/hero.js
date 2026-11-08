/**
 * ANAYAH ASSOCIATES — Hero Master Render & Architectural Vantage Controller
 * Orchestrates ultra-high-resolution 4K/8K architectural master frames,
 * seamless crossfades between vantage chapters, masked serif headline reveals,
 * delicate gold line transitions, and buttery rAF mouse parallax.
 */

import { decodeText } from './decode.js';

export const CHAPTERS = [
  {
    id: 'vision',
    img: 'assets/img/hero-chapters/chapter-6.webp',
    title: '01 / MASTER VISION',
    h1Line1: 'CRAFTING GENERATIONAL',
    h1Line2: 'ESTATES & LANDMARKS',
    p: 'Directed by Er. Sameer Subhedar Shaikh since 2018, Anayah Associates crafts bespoke residential estates, commercial hubs, and industrial landmarks across Maharashtra — blending uncompromising IS-code structural integrity with visionary architectural aesthetics.'
  },
  {
    id: 'bpms',
    img: 'assets/img/hero-chapters/chapter-2.webp',
    title: '02 / BPMS SANCTION',
    h1Line1: 'MUNICIPAL CLEARANCE &',
    h1Line2: 'BPMS COMPLIANCE',
    p: 'Complete Building Plan Management System (MahaBPMS / AutoDCR) scrutiny, town planning clearances, FSI optimization, setback audits, and statutory municipal sanctions across Maharashtra.'
  },
  {
    id: 'elevations',
    img: 'assets/img/hero-chapters/chapter-3.webp',
    title: '03 / 3D ELEVATION',
    h1Line1: 'PHOTOREALISTIC',
    h1Line2: '3D ARCHITECTURE',
    p: 'Hyper-detailed 3D exterior elevations, day & dusk lighting simulations, parametric facade cladding, and immersive walkthroughs bringing architectural concepts alive before ground breaking.'
  },
  {
    id: 'rcdesign',
    img: 'assets/img/hero-chapters/chapter-4.webp',
    title: '04 / RC STRUCTURAL CORE',
    h1Line1: 'IS-CODE STRUCTURAL',
    h1Line2: 'RC ENGINEERING',
    p: 'Seismic-resistant reinforced concrete design adhering to IS 456 & IS 1893, beam-column scheduling, and Bar Bending detailing engineered for generational stability.'
  },
  {
    id: 'execution',
    img: 'assets/img/hero-chapters/chapter-5.webp',
    title: '05 / PRECISION EXECUTION',
    h1Line1: 'ON-SITE LICENSED',
    h1Line2: 'ENGINEER PRESENCE',
    p: 'Uncompromising execution across residential, commercial, industrial, healthcare, and hospitality verticals — continuous licensed engineer supervision guaranteed on every site.'
  },
  {
    id: 'heritage',
    img: 'assets/img/hero-chapters/chapter-1.webp',
    title: '06 / COMPLETED LANDMARK',
    h1Line1: 'ROOTED IN SHRIRAMPUR,',
    h1Line2: 'TRUSTED STATEWIDE',
    p: 'From humble beginnings in 2018 to landmark high-rise residences and heavy agro-industrial plants, engineered with functional clarity and artistic intent.'
  }
];

export class HeroController {
  constructor() {
    this.heroSection = document.getElementById('hero');
    this.imgA = document.getElementById('hero-render-img-a');
    this.imgB = document.getElementById('hero-render-img-b');
    this.veil = document.getElementById('hero-veil');
    this.h1Row1 = document.querySelector('.hero-h1-row-1 .hero-h1-inner');
    this.h1Row2 = document.querySelector('.hero-h1-row-2 .hero-h1-inner');
    this.goldLine = document.getElementById('hero-gold-line');
    this.heroP = document.getElementById('hero-paragraph');
    this.indexRail = document.getElementById('hero-rail');
    this.railItems = document.querySelectorAll('.hero-rail-item');
    this.renderWrap = document.getElementById('hero-render-wrap');
    this.heroContent = document.querySelector('.hero-content');
    this.audioBtn = document.getElementById('hero-audio-btn');
    this.audioEl = document.getElementById('ambient-audio');

    this.currentIndex = 0;
    this.activeImgLayer = 'a'; // tracks whether imgA or imgB is active
    this.autoTimer = null;
    this.autoTimerInterval = 7000;
    this.userInteracted = false;
    this.isPaused = false;
    this.swapCounter = 0;

    // Mouse parallax tracking
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.currentMouseX = 0;
    this.currentMouseY = 0;
    this.rafId = null;
    this.isParallaxActive = false;

    this.init();
  }

  init() {
    if (!this.heroSection) return;

    this.setupRail();
    this.setupMouseParallax();
    this.setupIntersectionObserver();
    this.setupAudio();
    this.startAutoAdvance();

    // Check for reduced motion
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  setupRail() {
    this.railItems.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        this.userInteracted = true;
        this.stopAutoAdvance();
        this.goToChapter(idx);
      });

      btn.addEventListener('mouseenter', () => {
        this.isPaused = true;
      });
      btn.addEventListener('mouseleave', () => {
        this.isPaused = false;
      });
      btn.addEventListener('focus', () => {
        this.isPaused = true;
      });
      btn.addEventListener('blur', () => {
        this.isPaused = false;
      });
    });
  }

  startAutoAdvance() {
    if (this.reducedMotion || this.userInteracted) return;
    this.stopAutoAdvance();

    const advance = () => {
      if (!this.isPaused && !this.userInteracted && document.visibilityState === 'visible') {
        const next = (this.currentIndex + 1) % CHAPTERS.length;
        this.goToChapter(next);
      }
      this.autoTimer = setTimeout(advance, this.autoTimerInterval);
    };

    this.autoTimer = setTimeout(advance, this.autoTimerInterval);
  }

  stopAutoAdvance() {
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
  }

  goToChapter(index) {
    if (index === this.currentIndex && this.swapCounter > 0) return;
    this.currentIndex = index;
    const chapter = CHAPTERS[index];
    const ticket = ++this.swapCounter;

    // Update rail UI state
    this.railItems.forEach((btn, idx) => {
      const isActive = idx === index;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      const progressLine = btn.querySelector('.rail-progress-bar');
      if (progressLine) {
        progressLine.style.animation = 'none';
        progressLine.offsetHeight; // trigger reflow
        if (isActive && !this.userInteracted && !this.reducedMotion) {
          progressLine.style.animation = `railFill ${this.autoTimerInterval}ms linear forwards`;
        }
      }
    });

    if (this.reducedMotion) {
      // Instant switch for reduced motion
      if (this.h1Row1) this.h1Row1.textContent = chapter.h1Line1;
      if (this.h1Row2) this.h1Row2.textContent = chapter.h1Line2;
      if (this.heroP) this.heroP.textContent = chapter.p;
      if (this.imgA) this.imgA.src = chapter.img;
      return;
    }

    // 1. Smooth Visual Render Crossfade (Zero Video Buffering)
    this.crossfadeRender(chapter.img, ticket);

    // 2. Animated Headline & Description Text Swap with Mask
    this.animateTextSwap(chapter, ticket);
  }

  crossfadeRender(newSrc, ticket) {
    if (!this.imgA || !this.imgB) return;

    const nextLayer = this.activeImgLayer === 'a' ? this.imgB : this.imgA;
    const currentLayer = this.activeImgLayer === 'a' ? this.imgA : this.imgB;

    // Preload next image and smoothly crossfade
    nextLayer.src = newSrc;

    // When ready, crossfade
    const doSwap = () => {
      if (ticket !== this.swapCounter) return;
      nextLayer.classList.add('is-active');
      currentLayer.classList.remove('is-active');
      this.activeImgLayer = this.activeImgLayer === 'a' ? 'b' : 'a';
    };

    if (nextLayer.complete && nextLayer.naturalWidth) {
      doSwap();
    } else {
      nextLayer.onload = doSwap;
    }
  }

  animateTextSwap(chapter, ticket) {
    // Drop down into mask
    if (this.h1Row1) {
      this.h1Row1.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease';
      this.h1Row1.style.transform = 'translateY(112%)';
      this.h1Row1.style.opacity = '0';
    }
    if (this.h1Row2) {
      this.h1Row2.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s, opacity 0.35s ease 0.05s';
      this.h1Row2.style.transform = 'translateY(112%)';
      this.h1Row2.style.opacity = '0';
    }
    if (this.heroP) {
      this.heroP.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      this.heroP.style.opacity = '0';
      this.heroP.style.transform = 'translateY(10px)';
    }

    // Delicate gold line reset
    if (this.goldLine) {
      this.goldLine.classList.remove('is-revealed');
    }

    setTimeout(() => {
      if (ticket !== this.swapCounter) return;

      // Swap text content
      if (this.h1Row1) this.h1Row1.textContent = chapter.h1Line1;
      if (this.h1Row2) this.h1Row2.textContent = chapter.h1Line2;
      if (this.heroP) this.heroP.textContent = chapter.p;

      // Reset positions above the mask
      if (this.h1Row1) {
        this.h1Row1.style.transition = 'none';
        this.h1Row1.style.transform = 'translateY(-112%)';
      }
      if (this.h1Row2) {
        this.h1Row2.style.transition = 'none';
        this.h1Row2.style.transform = 'translateY(-112%)';
      }

      // Force reflow
      if (this.h1Row1) this.h1Row1.offsetHeight;

      // Animate back down to zero
      requestAnimationFrame(() => {
        if (ticket !== this.swapCounter) return;
        if (this.h1Row1) {
          this.h1Row1.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
          this.h1Row1.style.transform = 'translateY(0)';
          this.h1Row1.style.opacity = '1';
        }
        if (this.h1Row2) {
          this.h1Row2.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.08s, opacity 0.5s ease 0.08s';
          this.h1Row2.style.transform = 'translateY(0)';
          this.h1Row2.style.opacity = '1';
        }
        if (this.heroP) {
          this.heroP.style.transition = 'opacity 0.5s ease 0.15s, transform 0.5s var(--e-soft) 0.15s';
          this.heroP.style.opacity = '1';
          this.heroP.style.transform = 'translateY(0)';
        }
        if (this.goldLine) {
          this.goldLine.classList.add('is-revealed');
        }
      });
    }, 400);
  }

  setupMouseParallax() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || this.reducedMotion) return;

    window.addEventListener('mousemove', (e) => {
      // Normalize mouse coordinates (-1 to 1)
      this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;

      if (!this.isParallaxActive) {
        this.isParallaxActive = true;
        this.rafId = requestAnimationFrame(this.updateParallax.bind(this));
      }
    }, { passive: true });
  }

  updateParallax() {
    // Lerp smoothly toward target
    const lerp = 0.045;
    this.currentMouseX += (this.targetMouseX - this.currentMouseX) * lerp;
    this.currentMouseY += (this.targetMouseY - this.currentMouseY) * lerp;

    // Move render wrap subtly opposite to cursor
    if (this.renderWrap) {
      const offsetX = -this.currentMouseX * 1.6;
      const offsetY = -this.currentMouseY * 1.5;
      this.renderWrap.style.transform = `scale(1.04) translate3d(${offsetX.toFixed(2)}%, ${offsetY.toFixed(2)}%, 0)`;
    }

    // Move headline slightly in same direction
    if (this.heroContent) {
      const contentX = this.currentMouseX * 6;
      const contentY = this.currentMouseY * 5;
      this.heroContent.style.transform = `translate3d(${contentX.toFixed(1)}px, ${contentY.toFixed(1)}px, 0)`;
    }

    const diffX = Math.abs(this.targetMouseX - this.currentMouseX);
    const diffY = Math.abs(this.targetMouseY - this.currentMouseY);

    if (diffX > 0.001 || diffY > 0.001) {
      this.rafId = requestAnimationFrame(this.updateParallax.bind(this));
    } else {
      this.isParallaxActive = false;
    }
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          this.stopAutoAdvance();
        } else {
          this.startAutoAdvance();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(this.heroSection);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoAdvance();
      } else {
        this.startAutoAdvance();
      }
    });
  }

  setupAudio() {
    if (!this.audioBtn || !this.audioEl) return;

    let isPlaying = false;
    const label = this.audioBtn.querySelector('.audio-label');

    this.audioBtn.addEventListener('click', () => {
      if (isPlaying) {
        // Fade out
        let vol = this.audioEl.volume;
        const fadeInterval = setInterval(() => {
          vol = Math.max(0, vol - 0.05);
          this.audioEl.volume = vol;
          if (vol <= 0) {
            clearInterval(fadeInterval);
            this.audioEl.pause();
            isPlaying = false;
            if (label) {
              label.textContent = 'SOUND OFF';
              decodeText(label, { duration: 250 });
            }
          }
        }, 40);
      } else {
        // Fade in
        this.audioEl.volume = 0;
        this.audioEl.play().then(() => {
          isPlaying = true;
          if (label) {
            label.textContent = 'SOUND ON';
            decodeText(label, { duration: 250 });
          }
          let vol = 0;
          const fadeInterval = setInterval(() => {
            vol = Math.min(0.35, vol + 0.05);
            this.audioEl.volume = vol;
            if (vol >= 0.35) {
              clearInterval(fadeInterval);
            }
          }, 40);
        }).catch(() => {});
      }
    });
  }
}
