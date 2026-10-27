/**
 * ANAYAH ASSOCIATES — Hero Film & Chapter Controller
 * Manages video loop, chapter switching with veil crossfade,
 * masked headline row swaps, and smooth rAF mouse parallax.
 */

import { decodeText } from './decode.js';

export const CHAPTERS = [
  {
    id: 'vision',
    time: 0.0,
    title: 'VISION',
    h1Line1: 'ARCHITECTURAL CLARITY,',
    h1Line2: 'TIMELESS FORM',
    p: 'Led by Er. Sameer Subhedar Shaikh since 2018, Anayah Associates transforms ambitious masterplans into iconic landmarks across Maharashtra.'
  },
  {
    id: 'bpms',
    time: 2.2,
    title: 'BPMS TRACING',
    h1Line1: 'MUNICIPAL SANCTION &',
    h1Line2: 'BPMS COMPLIANCE',
    p: 'Complete Building Plan Management System (BPMS) scrutiny, town planning clearances, FSI optimization, and municipal sanction drawings.'
  },
  {
    id: 'elevations',
    time: 4.5,
    title: '3D ELEVATIONS',
    h1Line1: 'PHOTOREALISTIC',
    h1Line2: '3D VISUALIZATION',
    p: 'Hyper-detailed 3D exterior elevations, day & dusk lighting simulations, and walkthroughs bringing architectural concepts alive.'
  },
  {
    id: 'rcdesign',
    time: 6.8,
    title: 'RC DESIGN',
    h1Line1: 'IS-CODE STRUCTURAL',
    h1Line2: 'RC ENGINEERING',
    p: 'Seismic-resistant reinforced concrete design, beam-column scheduling, and Bar Bending detailing engineered for generational stability.'
  },
  {
    id: 'execution',
    time: 9.0,
    title: 'EXECUTION',
    h1Line1: 'PRECISION ON-SITE',
    h1Line2: 'GOVERNANCE',
    p: 'Uncompromising execution across residential, commercial, industrial, healthcare, and hospitality verticals throughout Maharashtra.'
  },
  {
    id: 'heritage',
    time: 10.5,
    title: 'HERITAGE',
    h1Line1: 'ROOTED IN SHRIRAMPUR,',
    h1Line2: 'TRUSTED STATEWIDE',
    p: 'From humble beginnings in 2018 to benchmark high-rise and industrial landmarks, engineered with functional clarity and artistic intent.'
  }
];

export class HeroController {
  constructor() {
    this.heroSection = document.getElementById('hero');
    this.video = document.getElementById('hero-video');
    this.videoSource = document.getElementById('hero-video-source');
    this.veil = document.getElementById('hero-veil');
    this.h1Row1 = document.querySelector('.hero-h1-row-1 .hero-h1-inner');
    this.h1Row2 = document.querySelector('.hero-h1-row-2 .hero-h1-inner');
    this.heroP = document.getElementById('hero-paragraph');
    this.indexRail = document.getElementById('hero-rail');
    this.railItems = document.querySelectorAll('.hero-rail-item');
    this.videoWrap = document.querySelector('.hero-video-wrap');
    this.heroContent = document.querySelector('.hero-content');
    this.audioBtn = document.getElementById('hero-audio-btn');
    this.audioEl = document.getElementById('ambient-audio');

    this.currentIndex = 0;
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
    if (!this.heroSection || !this.video) return;

    this.setupVideoSource();
    this.setupRail();
    this.setupMouseParallax();
    this.setupIntersectionObserver();
    this.setupAudio();
    this.startAutoAdvance();

    // Check for reduced motion
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  setupVideoSource() {
    const isMobile = window.innerWidth <= 768;
    const targetSrc = isMobile ? 'assets/video/hero-mobile.mp4' : 'assets/video/hero.mp4';
    if (this.videoSource && this.videoSource.getAttribute('src') !== targetSrc) {
      this.videoSource.setAttribute('src', targetSrc);
      this.video.load();
    }

    // Window resize check
    window.addEventListener('resize', () => {
      const nowMobile = window.innerWidth <= 768;
      const expected = nowMobile ? 'assets/video/hero-mobile.mp4' : 'assets/video/hero.mp4';
      if (this.videoSource && this.videoSource.getAttribute('src') !== expected) {
        const curTime = this.video.currentTime;
        this.videoSource.setAttribute('src', expected);
        this.video.load();
        this.video.currentTime = curTime;
        this.video.play().catch(() => {});
      }
    });
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

    // Update rail state
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
      // Instant switch
      if (this.h1Row1) this.h1Row1.textContent = chapter.h1Line1;
      if (this.h1Row2) this.h1Row2.textContent = chapter.h1Line2;
      if (this.heroP) this.heroP.textContent = chapter.p;
      if (this.video) this.video.currentTime = chapter.time;
      return;
    }

    // 1. Video crossfade via black veil
    if (this.veil) {
      this.veil.classList.add('is-active');
      setTimeout(() => {
        if (ticket !== this.swapCounter) return;
        this.seekOrSwitchVideo(chapter);
        setTimeout(() => {
          if (ticket !== this.swapCounter) return;
          this.veil.classList.remove('is-active');
        }, 120);
      }, 350);
    } else {
      this.seekOrSwitchVideo(chapter);
    }

    // 2. Animated text swap with masked reveal
    this.animateTextSwap(chapter, ticket);
  }

  seekOrSwitchVideo(chapter) {
    if (!this.video) return;
    // Check if separate clip exists data-src
    const customClip = this.video.dataset[`clip${chapter.id}`];
    if (customClip) {
      this.video.src = customClip;
      this.video.currentTime = 0;
      this.video.play().catch(() => {});
    } else {
      // Seek the main hero video
      this.video.currentTime = chapter.time;
      if (this.video.paused) {
        this.video.play().catch(() => {});
      }
    }
  }

  animateTextSwap(chapter, ticket) {
    const duration = 500; // ms
    // Drop down into mask
    if (this.h1Row1) {
      this.h1Row1.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease';
      this.h1Row1.style.transform = 'translateY(112%)';
      this.h1Row1.style.opacity = '0';
    }
    if (this.h1Row2) {
      this.h1Row2.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.05s, opacity 0.4s ease 0.05s';
      this.h1Row2.style.transform = 'translateY(112%)';
      this.h1Row2.style.opacity = '0';
    }
    if (this.heroP) {
      this.heroP.style.transition = 'transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.35s ease';
      this.heroP.style.transform = 'translateY(8px)';
      this.heroP.style.opacity = '0';
    }

    setTimeout(() => {
      if (ticket !== this.swapCounter) return;

      // Update text
      if (this.h1Row1) this.h1Row1.textContent = chapter.h1Line1;
      if (this.h1Row2) this.h1Row2.textContent = chapter.h1Line2;
      if (this.heroP) this.heroP.textContent = chapter.p;

      // Reset start positions above/below
      if (this.h1Row1) {
        this.h1Row1.style.transform = 'translateY(-112%)';
      }
      if (this.h1Row2) {
        this.h1Row2.style.transform = 'translateY(-112%)';
      }
      if (this.heroP) {
        this.heroP.style.transform = 'translateY(8px)';
      }

      // Force reflow
      if (this.h1Row1) this.h1Row1.offsetHeight;

      // Rise in from top to 0
      requestAnimationFrame(() => {
        if (ticket !== this.swapCounter) return;
        if (this.h1Row1) {
          this.h1Row1.style.transform = 'translateY(0)';
          this.h1Row1.style.opacity = '1';
        }
        if (this.h1Row2) {
          this.h1Row2.style.transform = 'translateY(0)';
          this.h1Row2.style.opacity = '1';
        }
        if (this.heroP) {
          this.heroP.style.transform = 'translateY(0)';
          this.heroP.style.opacity = '1';
        }
      });
    }, 450);
  }

  setupMouseParallax() {
    if (this.reducedMotion || 'ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    window.addEventListener('mousemove', (e) => {
      // Normalized offset -1 to 1 from center
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      this.targetMouseX = nx;
      this.targetMouseY = ny;

      if (!this.isParallaxActive) {
        this.isParallaxActive = true;
        this.rafId = requestAnimationFrame(this.renderParallax.bind(this));
      }
    });
  }

  renderParallax() {
    const lerp = 0.045;
    this.currentMouseX += (this.targetMouseX - this.currentMouseX) * lerp;
    this.currentMouseY += (this.targetMouseY - this.currentMouseY) * lerp;

    // Max offset 1.6% W, 1.5% H
    const maxOffsetW = window.innerWidth * 0.016;
    const maxOffsetH = window.innerHeight * 0.015;

    const vidX = -this.currentMouseX * maxOffsetW;
    const vidY = -this.currentMouseY * maxOffsetH;

    // Headline moves opposite at 30%
    const textX = this.currentMouseX * maxOffsetW * 0.3;
    const textY = this.currentMouseY * maxOffsetH * 0.3;

    if (this.videoWrap) {
      // Keep scale 1.08 to prevent showing edges
      this.videoWrap.style.transform = `translate3d(${vidX.toFixed(2)}px, ${vidY.toFixed(2)}px, 0) scale(1.08)`;
    }
    if (this.heroContent) {
      this.heroContent.style.transform = `translate3d(${textX.toFixed(2)}px, ${textY.toFixed(2)}px, 0)`;
    }

    const diffX = Math.abs(this.targetMouseX - this.currentMouseX);
    const diffY = Math.abs(this.targetMouseY - this.currentMouseY);

    if (diffX > 0.001 || diffY > 0.001) {
      this.rafId = requestAnimationFrame(this.renderParallax.bind(this));
    } else {
      this.isParallaxActive = false;
    }
  }

  setupIntersectionObserver() {
    // Pause video when offscreen or tab hidden to save resources
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!this.video) return;
        if (entry.isIntersecting && document.visibilityState === 'visible') {
          this.video.play().catch(() => {});
        } else {
          this.video.pause();
        }
      });
    }, { threshold: 0.1 });

    obs.observe(this.heroSection);

    document.addEventListener('visibilitychange', () => {
      if (!this.video) return;
      if (document.hidden) {
        this.video.pause();
      } else if (this.heroSection.getBoundingClientRect().bottom > 0) {
        this.video.play().catch(() => {});
      }
    });
  }

  setupAudio() {
    if (!this.audioBtn || !this.audioEl) return;

    this.audioBtn.addEventListener('click', () => {
      const isMuted = this.audioBtn.classList.contains('is-playing');
      if (isMuted) {
        // Fade out
        this.fadeAudio(0, () => {
          this.audioEl.pause();
          this.audioBtn.classList.remove('is-playing');
          this.audioBtn.querySelector('.audio-label').textContent = 'SOUND OFF';
          decodeText(this.audioBtn.querySelector('.audio-label'), { duration: 250 });
        });
      } else {
        // Fade in
        this.audioEl.volume = 0;
        this.audioEl.play().then(() => {
          this.audioBtn.classList.add('is-playing');
          this.audioBtn.querySelector('.audio-label').textContent = 'SOUND ON';
          decodeText(this.audioBtn.querySelector('.audio-label'), { duration: 250 });
          this.fadeAudio(0.35);
        }).catch(() => {
          // Fallback UI state toggle
          this.audioBtn.classList.toggle('is-playing');
        });
      }
    });
  }

  fadeAudio(targetVol, callback) {
    if (!this.audioEl) return;
    const step = 0.05;
    const interval = 40;
    const timer = setInterval(() => {
      if (Math.abs(this.audioEl.volume - targetVol) < step) {
        this.audioEl.volume = targetVol;
        clearInterval(timer);
        if (callback) callback();
      } else if (this.audioEl.volume < targetVol) {
        this.audioEl.volume = Math.min(1, this.audioEl.volume + step);
      } else {
        this.audioEl.volume = Math.max(0, this.audioEl.volume - step);
      }
    }, interval);
  }
}
