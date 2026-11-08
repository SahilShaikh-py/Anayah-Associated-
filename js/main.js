/* Anayah Associates — site behaviour (no dependencies) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Projects data (17 landmarks) ---------- */
  var P = 'assets/img/projects/';
  var projects = [
    { id: 'pathan-complex', cat: 'commercial', badge: 'Commercial · Multi-Storey', meta: 'Deolali Pravara · Tal-Rahuri', title: 'Pathan Commercial Complex', client: 'Client: Mr. Bashir Pathan', img: 'pathan-complex.webp', alt: 'Pathan Commercial Complex, Deolali Pravara',
      sector: 'COMMERCIAL COMPLEX · MULTI-STOREY', mtitle: 'Pathan Commercial Complex', location: 'Deolali Pravara, Tal-Rahuri, Dist-Ahilyanagar', mclient: 'Mr. Bashir Pathan', scope: 'BPMS Drawing, 3D Front View, Concrete Structure Design & Full Construction',
      desc: 'A multi-storey business building with shop fronts and flexible office space. It has wide-span concrete framing, energy-saving glass walls, and city approval done through MahaBPMS.' },
    { id: 'sai-shaneshwar', cat: 'industrial', badge: 'Industrial & Community', meta: 'Jatap · Ahilyanagar', title: 'Sai Shaneshwar Mangal Karyalay & Seed Plant', client: 'Client: Farmer Producer Co.', img: 'sai-shaneshwar-karyalay.webp', alt: 'Sai Shaneshwar Mangal Karyalay & Cotton Seed Processing',
      sector: 'INDUSTRIAL & COMMUNITY', mtitle: 'Sai Shaneshwar Mangal Karyalay & Cotton Seed Oil Plant', location: 'Jatap, Ahilyanagar', mclient: 'Sai Shaneshwar Farmer Producer Company', scope: 'Factory steel-frame (PEB) & concrete design, heavy machine foundation, community hall',
      desc: 'A large two-in-one landmark: a cotton seed oil factory and a big open-span Mangal Karyalay marriage hall that holds thousands of guests.' },
    { id: 'hotel-ganraj', cat: 'commercial', badge: 'Hotel Design', meta: 'Highway Corridor · Maharashtra', title: 'Hotel Ganraj Highway Landmark', client: 'Ganraj Hotels', img: 'hotel-ganraj.webp', alt: 'Hotel Ganraj Highway Architecture',
      sector: 'HOTEL DESIGN', mtitle: 'Hotel Ganraj Highway Landmark', location: 'State Highway Corridor, Maharashtra', mclient: 'Ganraj Hotel Group', scope: '3D Front View, Site Layout Plan, Full Construction',
      desc: 'A highway hotel with long LED light strips, open-sky rooftop dining, a big banquet hall and easy vehicle movement.' },
    { id: 'aasif-bhai', cat: 'residential', badge: 'Luxury Home', meta: 'Islampura · Shrirampur', title: 'Aasif Bhai Luxury Home', client: 'Client: Mr. Aasif Bhai', img: 'aasif-bhai-bungalow.webp', alt: 'Aasif Bhai Luxury Residence, Islampura',
      sector: 'LUXURY HOME', mtitle: 'Aasif Bhai Home', location: 'Islampura, Shrirampur', mclient: 'Mr. Aasif Bhai', scope: '3D Front View, Concrete Structure Design, Full Interior & Civil Work',
      desc: 'A custom two-storey luxury home with floating balconies, vertical wood-look slats, soft outer lighting and garden terraces.' },
    { id: 'gadhe-residence', cat: 'residential', badge: 'Modern Duplex Home', meta: 'Shrirampur · Ahilyanagar', title: 'Gadhe Duplex Home', client: 'Client: Gadhe Family', img: 'gadhe-residence-day.webp', alt: 'Gadhe Residence Architectural Duplex',
      sector: 'MODERN DUPLEX HOME', mtitle: 'Gadhe Home (Day & Evening Look)', location: 'Shrirampur, Ahilyanagar', mclient: 'Mr. Gadhe & Family', scope: '3D Front View (Day/Night), BPMS Drawing, Concrete Detailing',
      desc: 'A striking modern duplex bungalow with textured stone walls, built-in planters and special evening lighting that looks beautiful all day.' },
    { id: 'mangalmurti-residency', cat: 'commercial residential', badge: 'Residential & Commercial Tower', meta: 'Shrirampur · BPMS Approval', title: 'Proposed Mangalmurti Residency', client: 'Mangalmurti Group', img: 'mangalmurti-residency.webp', alt: 'Proposed Mangalmurti Residency Tower',
      sector: 'RESIDENTIAL & COMMERCIAL TOWER', mtitle: 'Proposed Mangalmurti Residency', location: 'Shrirampur, Dist-Ahilyanagar', mclient: 'Mangalmurti Developers', scope: 'BPMS City Approval, Concrete Structure Design, Real-Looking 3D Exterior',
      desc: 'A landmark apartment building with showrooms on the ground floor and family flats above. Designed to be earthquake-safe (IS-1893) with a front that stays cool.' },
    { id: 'dafal-bungalow', cat: 'residential', badge: 'Custom Bungalow Design', meta: 'Shrirampur · Maharashtra', title: 'Dafal Saheb Residence', client: 'Client: Mr. Dafal', img: 'dafal-bungalow.webp', alt: 'Dafal Saheb Residence',
      sector: 'CUSTOM BUNGALOW DESIGN', mtitle: 'Dafal Saheb Residence', location: 'Shrirampur, Maharashtra', mclient: 'Mr. Dafal', scope: 'Front View Design, Concrete Frame, Site Supervision',
      desc: 'A grand private villa that mixes classic, balanced looks with clean modern lines, big floor-to-ceiling windows and a very sturdy structure.' },
    { id: 'twin-bungalows', cat: 'residential', badge: 'Twin Villa Project', meta: 'Rahuri · Ahilyanagar', title: 'Twin Bungalows Scheme', client: 'Joint Private Homes', img: 'twin-bungalow-rahuri-1.webp', alt: 'Twin Bungalows at Rahuri',
      sector: 'RESIDENTIAL SCHEME', mtitle: 'Twin Bungalows Scheme', location: 'Rahuri, Ahilyanagar', mclient: 'Private Joint Families', scope: 'Master Plan, Matching 3D Front View, BPMS Approval',
      desc: 'Two matching bungalows with one modern front design, but each with its own privacy and its own concrete frame.' },
    { id: 'row-house', cat: 'residential', badge: 'Row Housing Scheme', meta: 'Shrirampur · BPMS Approved', title: 'Sonawane Row Bungalow Scheme', client: 'Sonawane Developers', img: 'row-house-scheme.webp', alt: 'Sonawane Row House Development',
      sector: 'HOUSING PROJECT', mtitle: 'Sonawane Modern Row Bungalow Scheme', location: 'Shrirampur, Ahilyanagar', mclient: 'Sonawane Developers', scope: 'Layout Plan, Row House Front View, Concrete Structure Design',
      desc: 'A row house project made for plenty of sunlight and fresh air in every plot, with the layout approved on MahaBPMS.' },
    { id: 'rukhmini-narayan', cat: 'residential commercial', badge: 'Multi-Storey Residential', meta: 'Shrirampur · RC Design', title: 'Rukhmini Narayan Apartment', client: 'Housing Society', img: 'rukhmini-narayan-apartment.webp', alt: 'Rukhmini Narayan Apartment',
      sector: 'MULTI-STOREY APARTMENTS', mtitle: 'Rukhmini Narayan Apartment', location: 'Shrirampur, Maharashtra', mclient: 'Private Housing Society', scope: 'Concrete Structure Design, Town Planning Check, Construction Management',
      desc: 'A modern multi-storey apartment building with basement parking, earthquake-safe columns and airy, Vastu-friendly flats.' },
    { id: 'jama-masjid', cat: 'religious', badge: 'Religious Building', meta: 'Deolali Pravara · Tall Minarets', title: 'Jama Masjid Landmark', client: 'Community Trust', img: 'jama-masjid-deolali.webp', alt: 'Jama Masjid Deolali Pravara',
      sector: 'RELIGIOUS & COMMUNITY BUILDING', mtitle: 'Jama Masjid Landmark', location: 'Deolali Pravara, Ahilyanagar', mclient: 'Masjid Trust & Community', scope: 'Religious Building Design, Minaret Structure Design, 3D Front View',
      desc: 'A holy building with tall minarets, fine Islamic arch designs and a wide prayer hall frame that stays cool and has good sound.' },
    { id: 'hotel-kranti', cat: 'commercial', badge: 'Hotel & Food Centre', meta: 'Ahilyanagar District', title: 'Hotel Kranti Commercial Hub', client: 'Kranti Hospitality', img: 'hotel-kranti.webp', alt: 'Hotel Kranti Hospitality Center',
      sector: 'HOTEL & BUSINESS', mtitle: 'Hotel Kranti Commercial Hub', location: 'Ahilyanagar District', mclient: 'Kranti Enterprise', scope: '3D Front View, New Front Look, Concrete Structure Design',
      desc: 'A full new front design and strengthening of the building, mixing a modern outer finish with strong food and stay facilities.' },
    { id: 'farmer-shopping', cat: 'industrial commercial', badge: 'Farm Trade & Steel Frame (PEB)', meta: 'Village Area · Steel Design', title: 'Farmer Producer Shopping Center', client: 'Farmer Producer Co.', img: 'farmer-producer-shopping.webp', alt: 'GI Sheet Shopping Center for Farmer Producer Co.',
      sector: 'FARM TRADE & INDUSTRIAL', mtitle: 'GI Sheet Shopping Centre & Farm Goods Storage', location: 'Ahilyanagar Rural Cluster', mclient: 'Farmer Producer Company', scope: 'Steel Frame Design, Cost Saving, Town Planning Approval',
      desc: 'A strong GI sheet shopping centre for village farm trade, with heavy-duty floors and quick-to-fit steel roof frames.' },
    { id: 'pilghar-villa', cat: 'residential', badge: 'Eco-Friendly Villa', meta: 'Shrirampur Area · Green Building', title: 'Pilghar Villa', client: 'Private Client', img: 'pilghar-luxury-bungalow.webp', alt: 'Pilghar Luxury Villa',
      sector: 'LUXURY HOME', mtitle: 'Pilghar Bungalow', location: 'Shrirampur Region', mclient: 'Private Client', scope: '3D Front View, Concrete Design, Eco-Friendly Building Design',
      desc: 'A large private home with sun-shading, wide garden verandahs, rainwater saving and a smooth, rich plaster finish.' },
    { id: 'kalhapure-residence', cat: 'residential', badge: 'Modern Home', meta: 'Shrirampur · Front Design', title: 'Kalhapure Modern Home', client: 'Kalhapure Family', img: 'kalhapure-bungalow.webp', alt: 'Kalhapure Bungalow Elevation',
      sector: 'PRIVATE HOME', mtitle: 'Kalhapure Bungalow', location: 'Shrirampur, Maharashtra', mclient: 'Kalhapure Family', scope: '3D Front View, Structure Details, Construction',
      desc: 'A clean modern home with box-shaped overhangs, soft warm lights and heat-saving brick walls.' },
    { id: 'daulatpur-bungalow', cat: 'residential', badge: 'Home Front Design', meta: 'Daulatpur · Maharashtra', title: 'Daulatpur Bungalow Design', client: 'Client: Mr. Khan Kalim', img: 'daulatpur-bungalow.webp', alt: 'Daulatpur Bungalow Elevation',
      sector: 'LOCAL HOME', mtitle: 'Daulatpur Bungalow Design', location: 'Daulatpur, Maharashtra', mclient: 'Mr. Khan Kalim', scope: '3D Front View & Perspective, Concrete Structure Details',
      desc: 'A custom home front with clean straight lines, weather-proof outer finish and a wide terrace pergola.' },
    { id: 'anayah-landmark', cat: 'residential', badge: 'Our Signature Design', meta: 'Timeless Design', title: 'Anayah Signature Villa', client: 'Private Commission', img: 'anayah-landmark-elevation.webp', alt: 'Anayah Signature Architectural Villa',
      sector: 'DESIGN CONCEPT & VILLA', mtitle: 'Anayah Signature Modern Home', location: 'Shrirampur, Ahilyanagar', mclient: 'Private Commission', scope: 'Complete Design, Engineering & Construction',
      desc: 'Our signature design that shows what we believe in: simple use, lasting strength and clear beauty.' }
  ];

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* ---------- Render portfolio ---------- */
  var grid = $('#projects-grid');
  if (grid) {
    grid.innerHTML = projects.map(function (p) {
      return '<button type="button" class="pcard reveal" data-category="' + p.cat + '" data-project-id="' + p.id + '">' +
        '<div class="pimg"><img src="' + P + p.img + '" alt="' + esc(p.alt) + '" loading="lazy">' +
        '<span class="pbadge">' + esc(p.badge) + '</span></div>' +
        '<p class="pmeta">' + esc(p.meta) + '</p><h3>' + esc(p.title) + '</h3>' +
        '<div class="pclient"><span>' + esc(p.client) + '</span><em>View specs &rarr;</em></div></button>';
    }).join('');
  }

  /* ---------- Filters ---------- */
  $$('.filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.filter').forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active'); btn.setAttribute('aria-selected', 'true');
      var f = btn.dataset.filter;
      $$('.pcard').forEach(function (c) {
        var show = f === 'all' || c.dataset.category.split(' ').indexOf(f) > -1;
        c.classList.toggle('is-hidden', !show);
        if (show) c.classList.add('is-in');
      });
    });
  });

  /* ---------- Modal ---------- */
  var modal = $('#project-modal');
  var trigger = null;
  function closeModal() {
    if (modal.close) modal.close(); else modal.removeAttribute('open');
    document.body.style.overflow = '';
    if (trigger) trigger.focus();
  }
  if (modal) {
    document.addEventListener('click', function (e) {
      var card = e.target.closest('.pcard');
      if (!card) return;
      var d = projects.filter(function (p) { return p.id === card.dataset.projectId; })[0];
      if (!d) return;
      trigger = card;
      $('#modal-sector').textContent = d.sector;
      $('#modal-title').textContent = d.mtitle;
      $('#modal-client').textContent = d.mclient;
      $('#modal-location').textContent = d.location;
      $('#modal-scope').textContent = d.scope;
      $('#modal-description').textContent = d.desc;
      var im = $('#modal-img'); im.src = P + d.img; im.alt = d.mtitle;
      if (modal.showModal) modal.showModal(); else modal.setAttribute('open', '');
      document.body.style.overflow = 'hidden';
    });
    $('#modal-close-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    modal.addEventListener('close', function () { document.body.style.overflow = ''; });
    $('.js-modal-inquire').addEventListener('click', closeModal);
  }

  /* ---------- Hero menu (mobile) ---------- */
  var stage = $('#stage'), burger = $('#burger'), menu = $('#menu');
  function setMenu(open) {
    stage.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!stage.classList.contains('is-open')); });
  $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && stage.classList.contains('is-open')) setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth / window.innerHeight > 1.1) setMenu(false); });

  /* ---------- Sticky header tint ---------- */
  var topbar = $('#topbar');
  function onScroll() { topbar.classList.toggle('is-scrolled', window.scrollY > window.innerHeight * 0.6); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Vantage chapters ---------- */
  var vimg = $('#vantage-img');
  $$('.vantage-item').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.vantage-item').forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
      b.classList.add('is-active'); b.setAttribute('aria-selected', 'true');
      vimg.style.opacity = 0;
      setTimeout(function () { vimg.src = 'assets/img/vantage/' + b.dataset.img + '.webp'; vimg.style.opacity = 1; }, 220);
    });
  });

  /* ---------- Hotspots (tap) ---------- */
  $$('.hotspot').forEach(function (h) {
    h.addEventListener('click', function (e) {
      e.stopPropagation();
      var was = h.classList.contains('is-open');
      $$('.hotspot').forEach(function (x) { x.classList.remove('is-open'); });
      if (!was) h.classList.add('is-open');
    });
  });
  document.addEventListener('click', function () { $$('.hotspot').forEach(function (x) { x.classList.remove('is-open'); }); });

  /* ---------- Experience years (from 2018) ---------- */
  var yrs = Math.max(8, new Date().getFullYear() - 2018);
  $$('.js-exp-years').forEach(function (el) { el.dataset.target = yrs; el.textContent = yrs; });
  $$('.js-current-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Counters + reveal ---------- */
  function fmt(n) { return n.toLocaleString('en-IN'); }
  function count(el) {
    var t = +el.dataset.target, start = null;
    if (reduce) { el.textContent = fmt(t); return; }
    (function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1600, 1);
      el.textContent = fmt(Math.round(t * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  /* --- animation targets --- */
  // headings: split into masked words
  $$('.h2, .h3, .statement').forEach(function (h) {
    if (h.closest('.modal')) return;
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'wrd';
            var s = document.createElement('span'); s.textContent = t; s.style.setProperty('--i', i++);
            w.appendChild(s); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(h);
    h.dataset.split = '1';
  });
  var anim = [];
  function add(sel, type, opts) {
    $$(sel).forEach(function (el, i) {
      opts = opts || {};
      if (type) el.classList.add(type);
      if (opts.anim) el.dataset.anim = opts.anim;
      if (opts.stagger) el.style.setProperty('--d', (i % (opts.mod || 6)) * opts.stagger + 'ms');
      anim.push(el);
    });
  }
  add('.sec .label, .sec .lead, .sec .row, .hint, .coords', 'reveal');
  add('.item, .counter, .service, .build-steps li, .creds li, .filter, .vantage-item', 'reveal', { stagger: 90, mod: 6 });
  add('.pcard', 'reveal', { stagger: 90, mod: 3 });
  add('.timeline li, .nb-item, .ccard', 'line', { stagger: 70, mod: 6 });
  add('.timeline li > *, .nb-item > *, .ccard > *', 'reveal');
  add('.founder-text > *, .split-text > *, .nb-list > .pill', 'reveal', { stagger: 80, mod: 8, anim: 'right' });
  add('.form', 'reveal', { anim: 'left' });
  add('.map', 'reveal', { anim: 'zoom' });
  add('.amen-visual', 'reveal', { anim: 'zoom' });
  ['.founder-photo', '.split-img', '.vantage-frame', '.build-visual', '.service-img'].forEach(function (sel) {
    $$(sel).forEach(function (el) { el.classList.add('mask'); anim.push(el); });
  });
  $$('.pimg').forEach(function (el) { el.classList.add('mask'); el.style.setProperty('--d', (Array.prototype.indexOf.call(el.closest('.projects').children, el.parentNode) % 3) * 110 + 'ms'); anim.push(el); });
  $$('.h2, .h3, .statement, .sec').forEach(function (el) { anim.push(el); });
  $$('.ongoing-status, .marquee').forEach(function (el) { el.classList.add('reveal'); anim.push(el); });
  $$('.footer-top > *, .footer-bottom').forEach(function (el, i) { el.classList.add('reveal'); el.style.setProperty('--d', i * 90 + 'ms'); anim.push(el); });

  function show(el) {
    el.classList.add('is-in');
    $$('.js-counter', el).forEach(count);
    if (el.classList.contains('js-counter')) count(el);
  }
  $$('.counter').forEach(function (c) { anim.push(c); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        show(en.target); io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    anim.forEach(function (el) { io.observe(el); });
  } else {
    anim.forEach(show);
  }

  /* --- scroll-driven: progress bar, hero parallax, image parallax (lerped) --- */
  var prog = $('#progress');
  var par = $$('.mask:not(.pimg)').map(function (m) { return { box: m, img: m.tagName === 'IMG' ? m : m.querySelector('img') }; }).filter(function (p) { return p.img; });
  var target = 0, cur = 0;
  function frame() {
    target = window.scrollY;
    cur += (target - cur) * 0.1;
    if (Math.abs(target - cur) < 0.1) cur = target;
    var vh = window.innerHeight, doc = document.documentElement.scrollHeight - vh;
    prog.style.setProperty('--p', doc > 0 ? (cur / doc).toFixed(4) : 0);
    if (!reduce) {
      par.forEach(function (p) {
        var r = p.box.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var c = (r.top + r.height / 2 - vh / 2) / vh;
        p.img.style.setProperty('--py', (c * -34).toFixed(1) + 'px');
      });
    }
    if (cur !== target) requestAnimationFrame(frame); else running = false;
  }
  var running = false;
  function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', kick);
  kick();

  /* ---------- Marquee (reacts to scroll velocity) ---------- */
  var track = $('.marquee-track');
  if (track && !reduce) {
    var x = 0, base = 0.8, speed = base, lastY = window.scrollY;
    (function loop() {
      x -= speed;
      var half = track.scrollWidth / 2;
      if (Math.abs(x) >= half) x = 0;
      track.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      speed += (base - speed) * 0.06;
      requestAnimationFrame(loop);
    })();
    window.addEventListener('scroll', function () { speed = base + Math.abs(window.scrollY - lastY) * 0.12; lastY = window.scrollY; }, { passive: true });
  }

  /* ---------- Toast / copy ---------- */
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('is-active');
    setTimeout(function () { t.classList.remove('is-active'); }, 3200);
  }
  $$('.js-copy-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.dataset.copyText;
      if (!navigator.clipboard) { toast('Could not copy automatically'); return; }
      navigator.clipboard.writeText(text).then(function () { toast('Copied: ' + text); }, function () { toast('Could not copy automatically'); });
    });
  });

  /* ---------- Enquiry form ---------- */
  function formData() {
    var v = function (id) { return ($('#' + id).value || '').trim(); };
    return {
      name: v('form-name'), phone: v('form-phone'), date: v('form-date'), type: $('#form-type').value,
      location: v('form-location'), message: v('form-message'),
      services: $$('input[name="service_req"]:checked').map(function (c) { return c.value; }).join(', ')
    };
  }
  var form = $('#enquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = formData();
      if (!/^[6-9]\d{9}$/.test(d.phone.replace(/\s+/g, ''))) {
        toast('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
        $('#form-phone').focus(); return;
      }
      var text = encodeURIComponent(
        '*Enquiry from Website — Anayah Associates*\n\n' +
        '• *Client Name:* ' + d.name + '\n• *Phone Number:* ' + d.phone + '\n' +
        '• *Preferred Meeting Date:* ' + (d.date || 'Earliest Available') + '\n' +
        '• *Project Type:* ' + d.type + '\n• *Services Needed:* ' + (d.services || d.type) + '\n' +
        '• *Site Location / Plot:* ' + (d.location || 'Shrirampur region') + '\n' +
        '• *Message:* ' + (d.message || 'I would like to talk to Er. Sameer Shaikh about my project.'));
      window.open('https://wa.me/918788731650?text=' + text, '_blank', 'noopener,noreferrer');
      toast('Opening WhatsApp with your enquiry...');
    });
    $('#form-email-btn').addEventListener('click', function () {
      var d = formData();
      var body = encodeURIComponent('Name: ' + d.name + '\nPhone: ' + d.phone + '\nPreferred Meeting Date: ' + (d.date || 'Earliest') +
        '\nServices: ' + (d.services || d.type) + '\nProject Type: ' + d.type + '\nLocation: ' + d.location + '\n\nMessage:\n' + d.message);
      window.location.href = 'mailto:sameiirshaikh@gmail.com?subject=Enquiry%20from%20Anayah%20Website&body=' + body;
    });
  }

  /* ---------- Lazy Google Map ---------- */
  var lm = $('#load-map-btn'), mc = $('#map-container');
  if (lm && mc) {
    lm.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.title = 'Anayah Associates Office Location in Shrirampur';
      f.src = 'https://www.google.com/maps?q=Sai+Super+Market+Main+Road+Shrirampur+Maharashtra&output=embed';
      f.loading = 'lazy'; f.setAttribute('allowfullscreen', '');
      mc.innerHTML = ''; mc.appendChild(f);
    });
  }

  /* ---------- Service enquiry boxes ---------- */
  $$('.inq').forEach(function (f) {
    var service = f.dataset.service;
    function build() {
      var msg = ($('textarea', f).value || '').trim();
      var inputs = $$('input', f), name = (inputs[0].value || '').trim(), phone = (inputs[1].value || '').trim();
      var extra = '';
      if (name) extra += '\nName: ' + name;
      if (phone) extra += '\nPhone: ' + phone;
      return 'Service: ' + service + '\n\n' + msg + extra;
    }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      window.open('https://wa.me/918788731650?text=' + encodeURIComponent(build()), '_blank', 'noopener,noreferrer');
      toast('Opening WhatsApp with your message...');
    });
    $('.inq-email', f).addEventListener('click', function () {
      window.location.href = 'mailto:sameiirshaikh@gmail.com?subject=' + encodeURIComponent('Enquiry: ' + service) + '&body=' + encodeURIComponent(build());
    });
  });

  /* ---------- Back to top ---------- */
  var top = $('#back-to-top');
  if (top) top.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---------- Boomerang video background ----------
     Play once, capture every frame to offscreen canvases (capped 960px wide),
     then ping-pong the captured frames on a <canvas> at 30fps. */
  (function boomerang() {
    var video = $('#bgv-video'), canvas = $('#bgv-canvas');
    if (!video || !canvas) return;
    var frames = [], lastT = -1, capturing = false, ready = false, retried = false;
    var maxW = window.innerWidth < 768 ? 640 : 960, MAX_FRAMES = 420;

    function capture() {
      if (!capturing) return;
      var t = video.currentTime;
      if (t !== lastT && video.videoWidth && frames.length < MAX_FRAMES) {
        lastT = t;
        var w = Math.min(maxW, video.videoWidth), h = Math.round(video.videoHeight * w / video.videoWidth);
        var c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(video, 0, 0, w, h);
        frames.push(c);
      }
      schedule();
    }
    function schedule() {
      if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(capture);
      else requestAnimationFrame(capture);
    }
    function startCapture() {
      if (capturing || ready) return;
      // skip the first moment of the clip (it fades in from plain white)
      try { if (video.currentTime < 0.6) video.currentTime = 0.6; } catch (e) {}
      capturing = true; schedule();
      var p = video.play(); if (p && p.catch) p.catch(function () {});
    }
    function startPlayback() {
      capturing = false;
      if (frames.length < 2) { video.loop = true; video.play(); return; }
      canvas.width = frames[0].width; canvas.height = frames[0].height;
      var ctx = canvas.getContext('2d'), idx = 0, dir = 1, last = 0, interval = 1000 / 30;
      ctx.drawImage(frames[0], 0, 0);
      video.style.display = 'none'; canvas.style.display = 'block'; ready = true;
      if (reduce) return;
      (function tick(ts) {
        if (ts - last >= interval) {
          last = ts;
          ctx.drawImage(frames[idx], 0, 0);
          if (idx >= frames.length - 1) dir = -1; else if (idx <= 0) dir = 1;
          idx += dir;
        }
        requestAnimationFrame(tick);
      })(0);
    }

    video.addEventListener('ended', startPlayback);
    video.addEventListener('error', function () {
      // CORS not offered by host: retry without crossorigin and just loop natively
      if (retried) return; retried = true;
      video.removeAttribute('crossorigin'); video.loop = true; video.load(); video.play().catch(function () {});
    });
    if (reduce) { video.addEventListener('loadeddata', function () { video.pause(); }); return; }
    if (video.readyState >= 3) startCapture();
    else { video.addEventListener('canplay', startCapture, { once: true }); video.load(); }
  })();
})();
