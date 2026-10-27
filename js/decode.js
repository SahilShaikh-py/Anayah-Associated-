/**
 * ANAYAH ASSOCIATES — Text Decode Effect
 * Resolves uppercase text left-to-right with a sliding glitch band of random glyphs.
 * Maintains fixed inline dimensions to prevent layout shifts.
 * Screen-reader safe: real text is always preserved in aria-label or accessible text.
 */

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789#%&*+';

/**
 * Decodes a single DOM element's text content.
 * @param {HTMLElement} el
 * @param {Object} [options]
 * @param {number} [options.duration=400] Total resolve duration in ms
 * @param {number} [options.bandWidth=3] Number of scrambled characters following the resolved front
 * @param {number} [options.tickInterval=45] Interval in ms for scrambling glyphs
 * @returns {Promise<void>}
 */
export function decodeText(el, options = {}) {
  if (!el) return Promise.resolve();

  // Cancel any running decode on this element
  if (el._decodeTimer) {
    clearInterval(el._decodeTimer);
    el._decodeTimer = null;
  }
  if (el._decodeTimeout) {
    clearTimeout(el._decodeTimeout);
    el._decodeTimeout = null;
  }

  const originalText = el.dataset.decodeOriginal || el.textContent.trim();
  el.dataset.decodeOriginal = originalText;
  
  // Ensure accessibility
  if (!el.getAttribute('aria-label')) {
    el.setAttribute('aria-label', originalText);
  }

  // Lock width to avoid layout jitter
  const rect = el.getBoundingClientRect();
  if (!el.style.minWidth && rect.width > 0) {
    el.style.minWidth = `${Math.ceil(rect.width)}px`;
    el.style.display = 'inline-block';
  }

  const duration = options.duration || 400;
  const bandWidth = options.bandWidth || 3;
  const tickInterval = options.tickInterval || 45;
  const len = originalText.length;
  if (len === 0) return Promise.resolve();

  const startTime = performance.now();

  return new Promise((resolve) => {
    // Settle callback to guarantee completion
    const settle = () => {
      if (el._decodeTimer) clearInterval(el._decodeTimer);
      el._decodeTimer = null;
      el.textContent = originalText;
      resolve();
    };

    el._decodeTimeout = setTimeout(settle, duration + 500);

    el._decodeTimer = setInterval(() => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      const resolvedIndex = Math.floor(progress * len);

      if (progress >= 1 || resolvedIndex >= len) {
        settle();
        return;
      }

      let output = '';
      for (let i = 0; i < len; i++) {
        const char = originalText[i];
        if (char === ' ' || char === '/' || char === '-' || char === '—' || char === ':' || char === '·' || char === '.') {
          output += char;
        } else if (i < resolvedIndex) {
          output += char;
        } else if (i < resolvedIndex + bandWidth) {
          output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        } else {
          output += ' ';
        }
      }

      el.textContent = output;
    }, tickInterval);
  });
}

/**
 * Initializes decode observers and hover listeners across the page.
 */
export function initDecode() {
  const elements = document.querySelectorAll('[data-decode]');
  elements.forEach((el) => {
    el.dataset.decodeOriginal = el.textContent.trim();
    if (!el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', el.dataset.decodeOriginal);
    }
  });

  // Attach hover trigger to interactive items with data-decode
  document.querySelectorAll('a[data-decode], button[data-decode], .decode-hover').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const target = item.hasAttribute('data-decode') ? item : item.querySelector('[data-decode]');
      if (target) decodeText(target, { duration: 320 });
    });
  });
}
