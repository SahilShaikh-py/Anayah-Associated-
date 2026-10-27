/**
 * ANAYAH ASSOCIATES — THE BUILD Canvas Image-Sequence Scrubber
 * Pinned ScrollTrigger scrub (0.6) with progressive loading (8th, 4th, 2nd, all),
 * nearest-frame cache, cover-fit math, devicePixelRatio cap, and synchronized HUD.
 */

import { decodeText } from './decode.js';

export const FRAME_COUNT = 280; // Full 280 high-definition frames from construction sequence

export class ScrubSequence {
  constructor() {
    this.section = document.getElementById('the-build');
    this.stage = document.getElementById('scrub-stage');
    this.canvas = document.getElementById('scrub-canvas');
    this.fallback = document.getElementById('scrub-fallback');
    this.hudFloor = document.getElementById('hud-floor');
    this.hudProgress = document.getElementById('hud-progress');
    this.hudRailFill = document.getElementById('hud-rail-fill');
    this.hudTicks = document.querySelectorAll('.hud-tick');
    this.captionItems = document.querySelectorAll('.scrub-stage-caption');

    if (!this.canvas || !this.section) return;

    this.ctx = this.canvas.getContext('2d', { alpha: false });
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }
    this.frames = new Array(FRAME_COUNT); // cache of decoded HTMLImageElement
    this.loadedSet = new Set();
    this.currentFrameIndex = 1;
    this.targetFrameIndex = 1;
    this.renderedFrameIndex = 0;
    this.currentProgress = 0;
    this.isRendering = false;
    this.isInView = false;
    this.isReducedMotion = false; // Always run the signature scroll sequence
    this.activeCaptionIdx = -1;

    // Determine path based on viewport and connection
    const isMobile = window.innerWidth <= 768 || (navigator.connection && navigator.connection.saveData);
    this.basePath = isMobile ? 'assets/seq/mobile/f_' : 'assets/seq/desktop/f_';

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) {
      this.setupFallback();
      return;
    }

    // Ensure canvas is active and fallback is hidden
    this.canvas.style.display = 'block';
    if (this.fallback) this.fallback.classList.remove('is-active');

    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.renderFrame(this.currentFrameIndex);
    }, { passive: true });

    // Preload first frame and last frame immediately
    Promise.all([this.loadFrame(1), this.loadFrame(FRAME_COUNT)]).then(() => {
      this.renderFrame(1);
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
      // Start progressive background loading
      this.startProgressiveLoad();
    });

    this.setupScrollTrigger();
  }

  setupFallback() {
    if (this.canvas) this.canvas.style.display = 'none';
    if (this.fallback) this.fallback.classList.add('is-active');
  }

  formatFrameUrl(index) {
    const padded = String(index).padStart(4, '0');
    return `${this.basePath}${padded}.webp`;
  }

  loadFrame(index) {
    if (this.frames[index - 1]) return Promise.resolve(this.frames[index - 1]);

    const url = this.formatFrameUrl(index);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.frames[index - 1] = img;
        this.loadedSet.add(index);
        // If newly loaded frame is closer to targetFrameIndex than what is currently rendered, redraw!
        if (this.renderedFrameIndex) {
          const currentDist = Math.abs(this.renderedFrameIndex - this.targetFrameIndex);
          const newDist = Math.abs(index - this.targetFrameIndex);
          if (newDist < currentDist) {
            this.renderFrame(this.targetFrameIndex);
          }
        }
        resolve(img);
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = url;
      if (img.complete && img.naturalWidth) {
        this.frames[index - 1] = img;
        this.loadedSet.add(index);
        resolve(img);
      }
    });
  }

  startProgressiveLoad() {
    // 1. Every 8th frame
    const pass1 = [];
    for (let i = 1; i <= FRAME_COUNT; i += 8) pass1.push(i);
    // 2. Every 4th frame
    const pass2 = [];
    for (let i = 1; i <= FRAME_COUNT; i += 4) {
      if (!this.loadedSet.has(i)) pass2.push(i);
    }
    // 3. Every 2nd frame
    const pass3 = [];
    for (let i = 1; i <= FRAME_COUNT; i += 2) {
      if (!this.loadedSet.has(i)) pass3.push(i);
    }
    // 4. Remaining frames
    const pass4 = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      if (!this.loadedSet.has(i)) pass4.push(i);
    }

    const loadQueue = async (queue, concurrency = 6) => {
      let idx = 0;
      const worker = async () => {
        while (idx < queue.length) {
          const item = queue[idx++];
          await this.loadFrame(item);
        }
      };
      const workers = Array.from({ length: concurrency }, () => worker());
      await Promise.all(workers);
    };

    // Sequential passes so key scrubber steps become interactive ultra-fast
    (async () => {
      await loadQueue(pass1, 6);
      await loadQueue(pass2, 6);
      await loadQueue(pass3, 6);
      await loadQueue(pass4, 6);
    })();
  }

  getNearestLoadedFrame(targetIdx) {
    if (this.frames[targetIdx - 1]) {
      this.renderedFrameIndex = targetIdx;
      return this.frames[targetIdx - 1];
    }

    // Search outwards for nearest loaded frame
    let offset = 1;
    while (offset < FRAME_COUNT) {
      const prev = targetIdx - offset;
      if (prev >= 1 && this.frames[prev - 1]) {
        this.renderedFrameIndex = prev;
        return this.frames[prev - 1];
      }
      const next = targetIdx + offset;
      if (next <= FRAME_COUNT && this.frames[next - 1]) {
        this.renderedFrameIndex = next;
        return this.frames[next - 1];
      }
      offset++;
    }
    return null;
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || window.innerWidth;
    const h = rect.height || window.innerHeight;

    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.dpr = dpr;
    this.viewWidth = w;
    this.viewHeight = h;
  }

  renderFrame(frameIndex) {
    if (!this.ctx || !this.canvas) return;

    const frame = this.getNearestLoadedFrame(frameIndex);
    if (!frame) return;

    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const fw = frame.naturalWidth || frame.width;
    const fh = frame.naturalHeight || frame.height;

    // Cover-fit math
    const hRatio = cw / fw;
    const vRatio = ch / fh;
    const ratio = Math.max(hRatio, vRatio);

    const drawW = fw * ratio;
    const drawH = fh * ratio;
    const drawX = (cw - drawW) / 2;
    const drawY = (ch - drawH) / 2;

    this.ctx.drawImage(frame, 0, 0, fw, fh, drawX, drawY, drawW, drawH);
  }

  setupScrollTrigger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.create({
      trigger: this.section,
      start: 'top top',
      end: 'bottom bottom',
      pin: this.stage,
      pinSpacing: false,
      scrub: 0.5,
      anticipatePin: 1,
      onEnter: () => { this.isInView = true; },
      onLeave: () => { this.isInView = false; },
      onEnterBack: () => { this.isInView = true; },
      onLeaveBack: () => { this.isInView = false; },
      onUpdate: (self) => {
        const progress = Math.max(0, Math.min(1, self.progress));
        this.currentProgress = progress;

        // Map 0 -> 1 to frame 1 -> FRAME_COUNT
        const frameIdx = Math.max(1, Math.min(FRAME_COUNT, Math.round(progress * (FRAME_COUNT - 1)) + 1));
        this.targetFrameIndex = frameIdx;

        this.updateHUD(progress);
        this.updateCaptions(progress);

        if (!this.isRendering) {
          this.isRendering = true;
          requestAnimationFrame(() => {
            this.currentFrameIndex = this.targetFrameIndex;
            this.renderFrame(this.currentFrameIndex);
            this.isRendering = false;
          });
        }
      }
    });
  }

  updateHUD(progress) {
    // 1. Percentage
    const pct = Math.round(progress * 100);
    if (this.hudProgress) {
      this.hudProgress.textContent = `${String(pct).padStart(3, '0')}%`;
    }

    // 2. Floor 00 -> 24 (Skyline Tower)
    const floor = Math.min(24, Math.floor(progress * 25));
    if (this.hudFloor) {
      this.hudFloor.textContent = `FLOOR ${String(floor).padStart(2, '0')}`;
    }

    // 3. Vertical progress rail fill
    if (this.hudRailFill) {
      this.hudRailFill.style.height = `${pct}%`;
    }

    // 4. Tick highlights based on 4 quadrants
    this.hudTicks.forEach((tick, idx) => {
      const threshold = idx * 0.25;
      tick.classList.toggle('is-passed', progress >= threshold);
    });

    // 5. Subtle camera scale 1.0 -> 1.06
    if (this.canvas) {
      const scale = 1.0 + progress * 0.06;
      this.canvas.style.transform = `scale(${scale.toFixed(3)})`;
    }
  }

  updateCaptions(progress) {
    // Stage intervals across 280 frames:
    // 01: 0 - 0.22 (Demarcation & Excavation)
    // 02: 0.22 - 0.48 (Reinforced Concrete Core)
    // 03: 0.48 - 0.76 (Facade Curtain Wall & Systems)
    // 04: 0.76 - 1.0 (Skyline Illumination & Handover)
    let currentStage = 0;
    if (progress >= 0.76) currentStage = 3;
    else if (progress >= 0.48) currentStage = 2;
    else if (progress >= 0.22) currentStage = 1;
    else currentStage = 0;

    if (currentStage !== this.activeCaptionIdx) {
      this.activeCaptionIdx = currentStage;
      this.captionItems.forEach((caption, idx) => {
        const isActive = idx === currentStage;
        if (isActive && !caption.classList.contains('is-visible')) {
          caption.classList.add('is-visible');
          const decodeLabel = caption.querySelector('[data-decode]');
          if (decodeLabel) decodeText(decodeLabel, { duration: 360 });
        } else if (!isActive && caption.classList.contains('is-visible')) {
          caption.classList.remove('is-visible');
        }
      });
    }
  }
}
