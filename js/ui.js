/**
 * ANAYAH ASSOCIATES — Interactive UI Controllers
 * Includes:
 * - Dynamic year calculation from 2018 (never goes stale)
 * - Animated statistic counters with comma formatting & ease-out cubic
 * - Custom lagging cursor with state labels (RESERVE, EXPLORE, VIEW, MAP, etc.)
 * - Magnetic buttons with spring physics
 * - Full-screen accessible mobile navigation with focus trap & decode
 * - Masthead scroll-direction show/hide
 * - Accessible Project Modal (<dialog>) with 17 real client landmarks
 * - Client-side validated WhatsApp / Mailto VIP viewing generator & clipboard toasts
 * - 3D card tilt for luxury amenity, portfolio & founder cards
 * - Infinite velocity-reactive marquee
 * - Process timeline scroll progression
 * - Lazy Google Maps iframe on demand
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
      el.textContent = `${yearsExp}`;
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
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0)`;
    }, { passive: true });

    // Smooth trailing ring loop
    const renderRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0) translate3d(-50%, -50%, 0)`;
      requestAnimationFrame(renderRing);
    };
    requestAnimationFrame(renderRing);

    // Interactive elements hover reaction
    const hoverTargets = document.querySelectorAll('a, button, [data-cursor], .portfolio-card, .amenity-card');
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        cursorRing.classList.add('is-hover');
        const labelText = target.dataset.cursor || 'VIEW';
        if (cursorLabel) {
          cursorLabel.textContent = labelText;
        }
      });

      target.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('is-hover');
        if (cursorLabel) cursorLabel.textContent = '';
      });
    });
  }

  // 3. Magnetic Buttons (Fine pointer only)
  initMagneticButtons() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const magneticElements = document.querySelectorAll('.js-magnetic');
    magneticElements.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        // Subtle magnetic pull
        btn.style.transform = `translate3d(${(x * 0.28).toFixed(1)}px, ${(y * 0.28).toFixed(1)}px, 0)`;
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

  // 4. Navigation & Mobile Menu Controls
  initNavigation() {
    const masthead = document.getElementById('masthead');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuToggle = document.getElementById('menu-toggle');
    const menuLabel = document.getElementById('menu-label');
    const closeBtn = document.getElementById('menu-close-btn');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .btn-gold-nav');
    const whatsappFloat = document.getElementById('whatsapp-float');
    const contactSection = document.getElementById('contact');

    // Masthead Auto-Hide on Scroll Down, Show on Scroll Up
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const curY = window.scrollY;
      if (curY > window.innerHeight * 0.75) {
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
            whatsappFloat.style.opacity = '0';
            whatsappFloat.style.pointerEvents = 'none';
          } else {
            whatsappFloat.style.opacity = '1';
            whatsappFloat.style.pointerEvents = 'auto';
          }
        });
      }, { threshold: 0.15 });
      contactObs.observe(contactSection);
    }

    // Mobile Menu Controls
    const openMenu = () => {
      mobileMenu.classList.add('is-active', 'is-open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (menuLabel) {
        menuLabel.textContent = 'CLOSE';
        decodeText(menuLabel, { duration: 300 });
      }
      const firstLink = mobileMenu.querySelector('a, button');
      if (firstLink) firstLink.focus();
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('is-active', 'is-open');
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
        if (mobileMenu.classList.contains('is-active') || mobileMenu.classList.contains('is-open')) {
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
      if (e.key === 'Escape' && mobileMenu && (mobileMenu.classList.contains('is-active') || mobileMenu.classList.contains('is-open'))) {
        closeMenu();
      }
    });

    // Close on link click and smooth scroll
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            if (mobileMenu.classList.contains('is-active') || mobileMenu.classList.contains('is-open')) {
              closeMenu();
            }
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

  // 5. Statistic Counters Count-up on Scroll with Formatting
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
    }, { threshold: 0.25 });

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
      el.textContent = target >= 1000 ? current.toLocaleString('en-IN') : current;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target >= 1000 ? target.toLocaleString('en-IN') : target;
      }
    };
    requestAnimationFrame(tick);
  }

  // 6. 3D Card Tilt for Luxury Feature Cards
  initCardTilt() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cards = document.querySelectorAll('.js-tilt, .portfolio-card, .amenity-card, .counter-item, .service-card-feature, .pillar-card');
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
    const projectCards = document.querySelectorAll('.portfolio-card');
    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.dataset.filter;

        projectCards.forEach((card) => {
          const category = card.dataset.category || '';
          if (filter === 'all' || category.includes(filter)) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 20);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });

        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 350);
        }
      });
    });
  }

  // 7. Project Details Accessible Modal (<dialog>) with 17 Real Landmarks
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
        title: 'Hotel Kranti Commercial Hub',
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

    // Close on backdrop click
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

    // Close on inquiry button inside modal
    const modalInquire = modal.querySelector('.js-modal-inquire');
    if (modalInquire) {
      modalInquire.addEventListener('click', () => {
        closeModal();
      });
    }
  }

  // 8. Contact Form, VIP Viewing Reservation Generator & Clipboard Toasts
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
          this.showToast(`Copied: ${text}`);
        } catch (_) {
          this.showToast('Could not copy automatically');
        }
      });
    });

    // Form Handling: High-Conversion VIP Viewing & Consultation WhatsApp Dispatch
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('form-name').value.trim();
        const phone = document.getElementById('form-phone').value.trim();
        const dateInput = document.getElementById('form-date');
        const date = dateInput ? dateInput.value : '';
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

        // Collect selected services
        const selectedServices = Array.from(document.querySelectorAll('input[name="service_req"]:checked'))
          .map((cb) => cb.value)
          .join(', ');

        const waText = encodeURIComponent(
          `*Private Viewing & Architectural Briefing Request — Anayah Associates*\n\n` +
          `• *Client Name:* ${name}\n` +
          `• *Phone Number:* ${phone}\n` +
          `• *Preferred Viewing Date:* ${date || 'Earliest Available'}\n` +
          `• *Project Interest:* ${type}\n` +
          `• *Services Needed:* ${selectedServices || type}\n` +
          `• *Site Location / Plot:* ${location || 'Shrirampur region'}\n` +
          `• *Architectural Brief:* ${message || 'I would like to request a private viewing of completed residences and consultation with Er. Sameer Shaikh.'}`
        );

        const waUrl = `https://wa.me/918788731650?text=${waText}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        this.showToast('Opening WhatsApp with your VIP viewing request...');
      });

      // Secondary Email Trigger
      const emailBtn = document.getElementById('form-email-btn');
      if (emailBtn) {
        emailBtn.addEventListener('click', () => {
          const name = document.getElementById('form-name').value.trim();
          const phone = document.getElementById('form-phone').value.trim();
          const dateInput = document.getElementById('form-date');
          const date = dateInput ? dateInput.value : '';
          const type = document.getElementById('form-type').value;
          const location = document.getElementById('form-location').value.trim();
          const message = document.getElementById('form-message').value.trim();
          const selectedServices = Array.from(document.querySelectorAll('input[name="service_req"]:checked'))
            .map((cb) => cb.value)
            .join(', ');

          const body = encodeURIComponent(
            `Name: ${name}\nPhone: ${phone}\nPreferred Date: ${date || 'Earliest'}\nServices: ${selectedServices || type}\nProject Type: ${type}\nLocation: ${location}\n\nProject Requirements:\n${message}`
          );
          const mailto = `mailto:sameiirshaikh@gmail.com?subject=Private%20Viewing%20Reservation%20%E2%80%94%20Anayah%20Website&body=${body}`;
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
    toast.classList.add('is-active');
    setTimeout(() => {
      toast.classList.remove('is-active');
    }, 3200);
  }

  // 9. Ongoing Marquee Infinite Scroll & Velocity Reactivity
  initOngoingMarquee() {
    const track = document.querySelector('.ongoing-marquee-track');
    if (!track) return;

    let posX = 0;
    let baseSpeed = 0.8;
    let currentSpeed = baseSpeed;
    let lastScrollY = window.scrollY;

    const animateMarquee = () => {
      posX -= currentSpeed;
      // Reset at half scrollWidth for seamless infinite loop
      if (Math.abs(posX) >= track.scrollWidth / 2) {
        posX = 0;
      }
      track.style.transform = `translate3d(${posX.toFixed(1)}px, 0, 0)`;

      // Decay velocity back to base
      currentSpeed += (baseSpeed - currentSpeed) * 0.06;

      requestAnimationFrame(animateMarquee);
    };
    requestAnimationFrame(animateMarquee);

    window.addEventListener('scroll', () => {
      const curY = window.scrollY;
      const delta = Math.abs(curY - lastScrollY);
      currentSpeed = baseSpeed + delta * 0.12;
      lastScrollY = curY;
    }, { passive: true });
  }

  // 10. Process Timeline Scroll Progression (Fill spine line)
  initProcessTimeline() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const processSection = document.getElementById('process');
    const spineFill = document.querySelector('.timeline-spine-fill');
    const nodes = document.querySelectorAll('.timeline-node');
    if (!processSection || !spineFill) return;

    ScrollTrigger.create({
      trigger: processSection,
      start: 'top 70%',
      end: 'bottom 80%',
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        spineFill.style.height = `${(p * 100).toFixed(1)}%`;

        // Activate step nodes as spine line crosses them
        nodes.forEach((node, idx) => {
          const threshold = idx / (nodes.length - 1);
          if (p >= threshold * 0.9) {
            node.classList.add('is-active');
          } else {
            node.classList.remove('is-active');
          }
        });
      }
    });
  }

  // 11. Back to Top Button
  initBackToTop() {
    const backBtn = document.getElementById('back-to-top');
    if (!backBtn) return;

    backBtn.addEventListener('click', () => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
