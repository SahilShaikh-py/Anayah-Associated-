/**
 * ANAYAH ASSOCIATES — Interactive UI Controllers
 * Includes:
 * - Dynamic year calculation from 2018 (never goes stale)
 * - Animated statistic counters with ScrollTrigger
 * - Custom lagging cursor with state labels (VIEW, DRAG, PLAY)
 * - Magnetic buttons with spring physics
 * - Full-screen accessible mobile navigation with focus trap & decode
 * - Masthead scroll-direction show/hide
 * - Accessible Project Modal (<dialog>)
 * - Client-side validated WhatsApp / Mailto contact generator & clipboard toasts
 * - 3D card tilt & SVG stroke drawing
 * - Infinite velocity-reactive marquee
 * - Process timeline scroll progression
 */

import { decodeText } from './decode.js';

export class UIController {
  constructor() {
    this.initDynamicYears();
    this.initCustomCursor();
    this.initMagneticButtons();
    this.initNavigation();
    this.initCounters();
    this.initCardTilt();
    this.initPortfolioFilter();
    this.initProjectModal();
    this.initContactActions();
    this.initOngoingMarquee();
    this.initProcessTimeline();
    this.initBackToTop();
  }

  // 1. Dynamic Year Calculation (2018 -> Current Year)
  initDynamicYears() {
    const currentYear = new Date().getFullYear();
    const yearsExp = Math.max(1, currentYear - 2018);

    // Update all year placeholders
    document.querySelectorAll('.js-exp-years').forEach((el) => {
      el.textContent = `${yearsExp}+`;
    });
    document.querySelectorAll('.js-current-year').forEach((el) => {
      el.textContent = currentYear;
    });
  }

  // 2. Custom Magnetic Cursor with Ring & Label
  initCustomCursor() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('no-custom-cursor');
      return;
    }

    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const cursorLabel = document.getElementById('cursor-label');
    if (!cursorDot || !cursorRing) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    const loop = () => {
      // Lerp ring
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    // Contextual Hover States
    document.querySelectorAll('[data-cursor]').forEach((target) => {
      target.addEventListener('mouseenter', () => {
        const type = target.dataset.cursor || '';
        cursorRing.classList.add('is-hover', `is-${type.toLowerCase()}`);
        if (cursorLabel) {
          cursorLabel.textContent = type;
        }
      });
      target.addEventListener('mouseleave', () => {
        cursorRing.className = 'cursor-ring';
        if (cursorLabel) cursorLabel.textContent = '';
      });
    });
  }

  // 3. Magnetic Buttons (pulls up to 8u toward cursor)
  initMagneticButtons() {
    if ('ontouchstart' in window) return;

    document.querySelectorAll('.js-magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.28;
        const deltaY = (e.clientY - centerY) * 0.28;
        btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          btn.style.transition = '';
        }, 400);
      });
    });
  }

  // 4. Navigation, Mobile Menu & Masthead Scroll Dynamics
  initNavigation() {
    const masthead = document.getElementById('masthead');
    const menuToggle = document.getElementById('menu-toggle');
    const menuLabel = document.getElementById('menu-label');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('menu-close-btn');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const whatsappFloat = document.getElementById('whatsapp-float');
    const contactSection = document.getElementById('contact');

    let lastScrollY = window.scrollY;

    // Show/hide masthead on scroll direction
    window.addEventListener('scroll', () => {
      const curY = window.scrollY;
      const heroHeight = window.innerHeight * 0.75;

      if (curY > heroHeight) {
        if (curY > lastScrollY && curY - lastScrollY > 10) {
          masthead.classList.add('is-hidden');
        } else if (lastScrollY - curY > 10) {
          masthead.classList.remove('is-hidden');
        }
      } else {
        masthead.classList.remove('is-hidden');
      }
      lastScrollY = curY;
    }, { passive: true });

    // Hide floating WhatsApp button when contact section is in view
    if (whatsappFloat && contactSection) {
      const contactObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            whatsappFloat.classList.add('is-hidden');
          } else {
            whatsappFloat.classList.remove('is-hidden');
          }
        });
      }, { threshold: 0.15 });
      contactObs.observe(contactSection);
    }

    // Mobile Menu Controls
    const openMenu = () => {
      mobileMenu.classList.add('is-open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (menuLabel) {
        menuLabel.textContent = 'CLOSE';
        decodeText(menuLabel, { duration: 300 });
      }
      // Focus first link
      const firstLink = mobileMenu.querySelector('a, button');
      if (firstLink) firstLink.focus();
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (menuLabel) {
        menuLabel.textContent = 'MENU';
        decodeText(menuLabel, { duration: 300 });
      }
      if (menuToggle) menuToggle.focus();
    };

    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        if (mobileMenu.classList.contains('is-open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // Close on Escape & trap focus
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Close on link click
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            if (mobileMenu.classList.contains('is-open')) closeMenu();
            if (window.lenis) {
              window.lenis.scrollTo(target, { offset: -60, duration: 1.2 });
            } else {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      });
    });
  }

  // 5. Statistic Counters Count-up on Scroll
  initCounters() {
    const counterElements = document.querySelectorAll('.js-counter');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetVal = parseInt(el.dataset.target, 10) || 0;
          this.animateNumber(el, targetVal, 1600);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach((el) => observer.observe(el));
  }

  animateNumber(el, target, duration = 1500) {
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(tick);
  }

  // 6. 3D Card Tilt for Expertise & Services Cards
  initCardTilt() {
    if ('ontouchstart' in window) return;

    const cards = document.querySelectorAll('.expertise-card, .service-card, .founder-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const rotX = ((y - cy) / cy) * -4; // +-4 degrees
        const rotY = ((x - cx) / cx) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  // 6b. Portfolio Category Filter
  initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const projectCards = document.querySelectorAll('.project-panel, .portfolio-card');
    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.filter || 'all';
        filterButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        projectCards.forEach((card) => {
          const cardCat = card.dataset.category || 'all';
          if (category === 'all' || cardCat === category || cardCat.includes(category)) {
            card.style.display = '';
            card.classList.remove('is-filtered-out');
            setTimeout(() => { card.style.opacity = '1'; }, 10);
          } else {
            card.style.opacity = '0';
            card.classList.add('is-filtered-out');
            setTimeout(() => {
              if (card.classList.contains('is-filtered-out')) {
                card.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }

  // 7. Accessible Project Dialog Modal
  initProjectModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    if (!modal) return;

    const projectData = {
      'pathan-complex': {
        sector: 'COMMERCIAL COMPLEX · MULTI-STOREY',
        title: 'Pathan Commercial Complex',
        location: 'Deolali Pravara, Tal-Rahuri, Dist-Ahilyanagar',
        client: 'Mr. Bashir Pathan',
        scope: 'BPMS Tracing, 3D Elevation, RC Structural Design & Complete Execution',
        description: 'Multi-storey commercial business hub engineered for modern retail frontages and flexible corporate office modules. Incorporates wide-span RCC framing, energy-efficient glazing envelope, and automated municipal approval sanction under MahaBPMS.',
        img: 'assets/img/projects/pathan-complex.webp'
      },
      'mangalmurti-residency': {
        sector: 'RESIDENTIAL & COMMERCIAL TOWER',
        title: 'Proposed Mangalmurti Residency',
        location: 'Shrirampur, Dist-Ahilyanagar',
        client: 'Mangalmurti Developers',
        scope: 'BPMS Municipal Sanction, Structural RC Design, 3D Photorealistic Exterior',
        description: 'Iconic multi-storey residential apartment development combining ground-floor commercial showroom spaces with multi-family luxury apartments. Designed with seismic IS-1893 compliance and thermal-optimized facade geometry.',
        img: 'assets/img/projects/mangalmurti-residency.webp'
      },
      'rukhmini-narayan': {
        sector: 'MULTI-STOREY APARTMENTS',
        title: 'Rukhmini Narayan Apartment',
        location: 'Shrirampur, Maharashtra',
        client: 'Private Housing Society',
        scope: 'RC Structural Design, Town Planning Scrutiny, Construction Governance',
        description: 'Contemporary multi-storey residential complex with dedicated basement stilt parking, earthquake-resistant framed columns, and cross-ventilated vastu-compliant floor designs.',
        img: 'assets/img/projects/rukhmini-narayan-apartment.webp'
      },
      'hotel-ganraj': {
        sector: 'HOSPITALITY ARCHITECTURE',
        title: 'Hotel Ganraj Highway Landmark',
        location: 'State Highway Corridor, Maharashtra',
        client: 'Ganraj Hospitality Group',
        scope: '3D Elevation Modeling, Master Site Planning, Turnkey Construction',
        description: 'Distinctive highway hospitality landmark designed with dramatic horizontal LED accent lighting, open-to-sky rooftop dining, expansive banquet hall, and high-flow vehicular circulation.',
        img: 'assets/img/projects/hotel-ganraj.webp'
      },
      'hotel-kranti': {
        sector: 'HOSPITALITY & COMMERCIAL',
        title: 'Hotel Kranti',
        location: 'Ahilyanagar District',
        client: 'Kranti Enterprise',
        scope: '3D Elevation, Facade Modernization, RC Structural Engineering',
        description: 'Full-scale architectural facade intervention and structural rehabilitation, integrating contemporary exterior finishes with robust commercial food and lodging facilities.',
        img: 'assets/img/projects/hotel-kranti.webp'
      },
      'sai-shaneshwar': {
        sector: 'INDUSTRIAL & COMMUNITY',
        title: 'Sai Shaneshwar Mangal Karyalay & Cotton Seed Oil Plant',
        location: 'Jatap, Ahilyanagar',
        client: 'Sai Shaneshwar Farmer Producer Company',
        scope: 'Industrial PEB & RC Design, Heavy Machinery Foundation, Community Auditorium',
        description: 'Large-scale dual-purpose landmark spanning heavy industrial processing for cotton seed oil extraction alongside an expansive, clear-span Mangal Karyalay community marriage hall accommodating thousands.',
        img: 'assets/img/projects/sai-shaneshwar-karyalay.webp'
      },
      'farmer-shopping': {
        sector: 'AGRI-COMMERCIAL & INDUSTRIAL',
        title: 'GI Sheet Shopping Center & Agro Logistics',
        location: 'Ahilyanagar Rural Cluster',
        client: 'Farmer Producer Company',
        scope: 'Structural Steel Framing, Cost Optimization, Town Planning Approval',
        description: 'Engineered galvanized iron industrial retail shopping hub serving rural agricultural trade, with heavy-load flooring and rapid-assembly modular steel roof trusses.',
        img: 'assets/img/projects/farmer-producer-shopping.webp'
      },
      'aasif-bhai': {
        sector: 'LUXURY RESIDENTIAL VILLA',
        title: 'Aasif Bhai Residence',
        location: 'Islampura, Shrirampur',
        client: 'Mr. Aasif Bhai',
        scope: '3D Elevation, RC Structural Engineering, Turnkey Interior & Civil Execution',
        description: 'A bespoke two-storey luxury residence showcasing cantilevered floating balconies, vertical wood-textured louvers, dynamic exterior cove illumination, and landscaped terraces.',
        img: 'assets/img/projects/aasif-bhai-bungalow.webp'
      },
      'gadhe-residence': {
        sector: 'CONTEMPORARY DUPLEX RESIDENCE',
        title: 'Gadhe Residence (Day & Evening Landmark)',
        location: 'Shrirampur, Ahilyanagar',
        client: 'Mr. Gadhe & Family',
        scope: '3D Elevation (Day/Night Study), BPMS Tracing, RCC Detailing',
        description: 'Striking contemporary duplex bungalow featuring dramatic textured stone claddings, integrated planters, and specialized evening architectural illumination designed for timeless curb appeal.',
        img: 'assets/img/projects/gadhe-residence-day.webp'
      },
      'dafal-bungalow': {
        sector: 'BESPOKE BUNGALOW DESIGN',
        title: 'Dafal Saheb Residence',
        location: 'Shrirampur, Maharashtra',
        client: 'Mr. Dafal',
        scope: 'Architectural Elevation, RCC Framed Structure, Site Supervision',
        description: 'Grand private villa blending classical symmetrical grandeur with sleek modern architectural lines, expansive floor-to-ceiling windows, and meticulous structural stability.',
        img: 'assets/img/projects/dafal-bungalow.webp'
      },
      'twin-bungalows': {
        sector: 'RESIDENTIAL SCHEME',
        title: 'Twin Bungalows Scheme',
        location: 'Rahuri, Ahilyanagar',
        client: 'Private Joint Families',
        scope: 'Architectural Masterplan, Twin Symmetry 3D Elevation, BPMS Sanction',
        description: 'Harmonious twin bungalow residences sharing a synchronized contemporary facade language while preserving individual structural privacy and independent RCC frames.',
        img: 'assets/img/projects/twin-bungalow-rahuri-1.webp'
      },
      'row-house': {
        sector: 'HOUSING DEVELOPMENT',
        title: 'Sonawane Modern Row Bungalow Scheme',
        location: 'Shrirampur, Ahilyanagar',
        client: 'Sonawane Developers',
        scope: 'Master Layout Plan, Row House Elevation, RC Structural Design',
        description: 'A high-efficiency row housing scheme maximizing natural sunlight and cross-ventilation across individual modular plots, certified with MahaBPMS layout sanctioning.',
        img: 'assets/img/projects/row-house-scheme.webp'
      },
      'pilghar-villa': {
        sector: 'LUXURY RESIDENTIAL ESTATE',
        title: 'Pilghar Executive Bungalow',
        location: 'Shrirampur Region',
        client: 'Private Client',
        scope: '3D Elevation, RC Design, Sustainable Eco-Sensitive Architecture',
        description: 'Expansive private residence integrating sustainable passive solar shading, large landscaped verandahs, rainwater harvesting systems, and premium monolithic plaster finishes.',
        img: 'assets/img/projects/pilghar-luxury-bungalow.webp'
      },
      'kalhapure-residence': {
        sector: 'PRIVATE RESIDENCE',
        title: 'Kalhapure Bungalow',
        location: 'Shrirampur, Maharashtra',
        client: 'Kalhapure Family',
        scope: '3D Elevation, Structural Detailing, Project Execution',
        description: 'Clean-lined modern home with geometric box-cantilever profiles, recessed ambient warm lighting, and thermal-break brick masonry construction.',
        img: 'assets/img/projects/kalhapure-bungalow.webp'
      },
      'daulatpur-bungalow': {
        sector: 'REGIONAL RESIDENCE',
        title: 'Daulatpur Bungalow Design',
        location: 'Daulatpur, Maharashtra',
        client: 'Mr. Khan Kalim',
        scope: '3D Elevation & Perspective Study, RC Structural Detailing',
        description: 'Custom suburban residential elevation engineered with clean vertical lines, weather-resistant exterior textures, and expansive terrace pergola pergolas.',
        img: 'assets/img/projects/daulatpur-bungalow.webp'
      },
      'jama-masjid': {
        sector: 'RELIGIOUS & COMMUNITY ARCHITECTURE',
        title: 'Jama Masjid Architectural Landmark',
        location: 'Deolali Pravara, Ahilyanagar',
        client: 'Masjid Trust & Community',
        scope: 'Sacred Architecture, Minaret Structural Engineering, 3D Elevation',
        description: 'Spiritual architecture featuring grand towering minarets, intricate Islamic arch geometry, and large-span prayer hall RCC framing engineered with acoustic and natural cooling principles.',
        img: 'assets/img/projects/jama-masjid-deolali.webp'
      },
      'anayah-landmark': {
        sector: 'ARCHITECTURAL CONCEPT & VILLA',
        title: 'Anayah Signature Modern Residence',
        location: 'Shrirampur, Ahilyanagar',
        client: 'Private Commission',
        scope: 'Complete Turnkey Architectural Design & Engineering',
        description: 'Signature architectural intervention illustrating the firm’s core philosophy: functional clarity, timeless structural integrity, and distinct visual elegance.',
        img: 'assets/img/projects/anayah-landmark-elevation.webp'
      }
    };

    let activeTrigger = null;

    document.querySelectorAll('.js-open-modal').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTrigger = btn;
        const pid = btn.dataset.projectId;
        const data = projectData[pid];
        if (!data) return;

        document.getElementById('modal-sector').textContent = data.sector;
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-client').textContent = data.client;
        document.getElementById('modal-location').textContent = data.location;
        document.getElementById('modal-scope').textContent = data.scope;
        document.getElementById('modal-description').textContent = data.description;
        const modalImg = document.getElementById('modal-img');
        if (modalImg) modalImg.src = data.img;

        if (typeof modal.showModal === 'function') {
          modal.showModal();
        } else {
          modal.setAttribute('open', '');
        }
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
      document.body.style.overflow = '';
      if (activeTrigger) activeTrigger.focus();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) closeModal();
    });
  }

  // 8. Contact Form, WhatsApp Generator & Clipboard Toasts
  initContactActions() {
    const form = document.getElementById('enquiry-form');
    const toast = document.getElementById('toast');
    const loadMapBtn = document.getElementById('load-map-btn');
    const mapContainer = document.getElementById('map-container');

    // Clipboard Copy Buttons
    document.querySelectorAll('.js-copy-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copyText;
        if (!text) return;
        try {
          await navigator.clipboard.writeText(text);
          this.showToast(`Copied to clipboard: ${text}`);
        } catch (_) {
          this.showToast('Could not copy automatically');
        }
      });
    });

    // Form Handling (Client-side validated WhatsApp / Mailto generation)
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('form-name').value.trim();
        const phone = document.getElementById('form-phone').value.trim();
        const type = document.getElementById('form-type').value;
        const location = document.getElementById('form-location').value.trim();
        const message = document.getElementById('form-message').value.trim();

        // 10-digit Indian phone validation
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
          alert('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
          document.getElementById('form-phone').focus();
          return;
        }

        /* 
         * Formspree / Netlify Forms Integration Note:
         * To submit to an endpoint, uncomment the fetch call below:
         * 
         * await fetch("https://formspree.io/f/YOUR_ENDPOINT", {
         *   method: "POST",
         *   body: new FormData(form),
         *   headers: { 'Accept': 'application/json' }
         * });
         */

        // Collect selected services
        const selectedServices = Array.from(document.querySelectorAll('input[name="service_req"]:checked'))
          .map((cb) => cb.value)
          .join(', ');

        const waText = encodeURIComponent(
          `*New Project Consultation — Anayah Associates*\n\n` +
          `• *Client Name:* ${name}\n` +
          `• *Phone Number:* ${phone}\n` +
          `• *Services Needed:* ${selectedServices || type}\n` +
          `• *Project Sector:* ${type}\n` +
          `• *Site Location / Plot:* ${location || 'Shrirampur region'}\n` +
          `• *Project Brief:* ${message || 'I would like to discuss a project with Er. Sameer Shaikh.'}`
        );

        const waUrl = `https://wa.me/918788731650?text=${waText}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        this.showToast('Opening WhatsApp with your project details...');
      });

      // Secondary Email Trigger
      const emailBtn = document.getElementById('form-email-btn');
      if (emailBtn) {
        emailBtn.addEventListener('click', () => {
          const name = document.getElementById('form-name').value.trim();
          const phone = document.getElementById('form-phone').value.trim();
          const type = document.getElementById('form-type').value;
          const location = document.getElementById('form-location').value.trim();
          const message = document.getElementById('form-message').value.trim();
          const selectedServices = Array.from(document.querySelectorAll('input[name="service_req"]:checked'))
            .map((cb) => cb.value)
            .join(', ');

          const body = encodeURIComponent(
            `Name: ${name}\nPhone: ${phone}\nServices: ${selectedServices || type}\nProject Type: ${type}\nLocation: ${location}\n\nProject Requirements:\n${message}`
          );
          const mailto = `mailto:sameiirshaikh@gmail.com?subject=Project%20Enquiry%20%E2%80%94%20Website&body=${body}`;
          window.location.href = mailto;
        });
      }
    }

    // Lazy Google Map Loader (No external tracking until user explicitly requests)
    if (loadMapBtn && mapContainer) {
      loadMapBtn.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.title = 'Anayah Associates Office Location in Shrirampur';
        iframe.src = 'https://www.google.com/maps?q=Sai+Super+Market+Main+Road+Shrirampur+Maharashtra&output=embed';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = '0';
        iframe.loading = 'lazy';
        iframe.setAttribute('allowfullscreen', '');
        mapContainer.innerHTML = '';
        mapContainer.appendChild(iframe);
      });
    }
  }

  showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  // 9. Ongoing Live Sites Marquee with Scroll Velocity
  initOngoingMarquee() {
    const track = document.querySelector('.ongoing-marquee-track');
    if (!track) return;

    let baseSpeed = 0.8;
    let currentX = 0;
    let scrollVelocity = 0;
    let lastY = window.scrollY;

    window.addEventListener('scroll', () => {
      const curY = window.scrollY;
      scrollVelocity = (curY - lastY) * 0.12;
      lastY = curY;
    }, { passive: true });

    const animateMarquee = () => {
      currentX -= (baseSpeed + scrollVelocity);
      scrollVelocity *= 0.94; // Decay velocity

      if (Math.abs(currentX) >= track.scrollWidth / 2) {
        currentX = 0;
      }
      track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
      requestAnimationFrame(animateMarquee);
    };
    requestAnimationFrame(animateMarquee);
  }

  // 10. Process Timeline Drawing Line & Node Highlighting
  initProcessTimeline() {
    if (typeof ScrollTrigger === 'undefined') return;

    const timelineSection = document.getElementById('process');
    const spineFill = document.querySelector('.timeline-spine-fill');
    const nodes = document.querySelectorAll('.timeline-node');
    if (!timelineSection || !spineFill) return;

    ScrollTrigger.create({
      trigger: timelineSection,
      start: 'top 70%',
      end: 'bottom 60%',
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        spineFill.style.height = `${(p * 100).toFixed(1)}%`;
        nodes.forEach((node, idx) => {
          const threshold = idx / (nodes.length - 1);
          node.classList.toggle('is-active', p >= threshold);
        });
      }
    });
  }

  // 11. Smooth Back to Top
  initBackToTop() {
    const backBtn = document.getElementById('back-to-top');
    if (!backBtn) return;
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
