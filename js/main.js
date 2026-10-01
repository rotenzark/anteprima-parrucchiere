/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'anteprima-parrucchiere',
    /* nessun WhatsApp: nessuna prova che lo usino (telefono fisso 02 715754, prenotazioni su Treatwell) */
    whatsapp: { number: '', message: '', ids: [] },
    /* la scheda Google (2/10/2026): martedì–venerdì 9:30–18, sabato 9–18, domenica e lunedì chiuso; orario continuato */
    hours: {
      0: [], 1: [],
      2: [['09:30', '18:00']], 3: [['09:30', '18:00']], 4: [['09:30', '18:00']], 5: [['09:30', '18:00']],
      6: [['09:00', '18:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1060,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Anteprima: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.salone": "The salon",
      "n.servizi": "Services",
      "n.colore": "Colour",
      "n.storia": "Roberto and Priscilla",
      "n.dicono": "Reviews",
      "n.orari": "Hours",
      "t.chiama": "Call",
      "t.prenota": "Book on Treatwell",
      "t.prenota2": "Book",
      "t.indicazioni": "Directions",
      "h.sopra": "Hairdresser for women · Viale Corsica 42/B · Milan",
      "h.testo": "Cuts, colour and highlights, blow-dries and treatments. Roberto opened Anteprima in the late Seventies; today he and Priscilla run the salon.",
      "h.voto": "on Treatwell, 90 reviews",
      "p.titolo": "The column of light",
      "p.desc": "The sage-green column of our salon, with the strip of white light wrapped around it in a spiral from the floor to the ceiling; below, the cherry-wood base. In the second drawing the same spiral without the column: a ringlet, like a lock of hair wound on the curling iron, dark brown at the root and honey-coloured at the ends, with balayage highlights.",
      "p.d0": "The column in our salon: sage green, with the strip of light climbing in a spiral up to the ceiling.",
      "p.d1": "Take the column away and the spiral is left: a lock of hair wound on the curling iron. A ringlet, dark at the root and honey-coloured at the ends, with balayage highlights.",
      "p.modi": "What to look at",
      "p.b0": "The column",
      "p.b1": "The ringlet",
      "s.etichetta": "The salon",
      "s.titolo": "Sage green, cherry wood and light",
      "s.intro": "At Viale Corsica 42: sage-green walls, columns wrapped in the spiral of light, cherry-wood mirror stations all curves, blue stools, the white armchairs of the waiting area and the marble floor.",
      "a.salone": "The salon: a sage-green column wrapped in the strip of light, the curved cherry-wood mirror stations with purple lamps, the blue stools, a white armchair with a golden cushion, the pale marble floor.",
      "s.fsalone": "The salon, with the column of light",
      "a.postazioni": "Two stations: the blue stools with wooden backrests, the cherry-wood console with its knobs, the mirrors with curved frames.",
      "s.fpostazioni": "The stations",
      "a.lavatesta": "The black backwash basins in a row, under the shelves with the bottles.",
      "s.flavatesta": "The basins",
      "a.attesa": "The waiting area: three white armchairs around a glass table with flowers; the lit shelves at the back.",
      "s.fattesa": "The waiting area",
      "a.cassa": "The entrance: the marble and cherry-wood desk, a white chest of drawers with a curved outline, the lit shelves with the products.",
      "s.fcassa": "The desk by the entrance",
      "s.citf": "Martina, on Treatwell",
      "a.colonna": "The column in the evening: the strip of white light switched on, winding around the green column up to the ceiling.",
      "s.fcolonna": "The real column, in the evening",
      "v.etichetta": "Services",
      "v.titolo": "What’s written in our window",
      "v.intro": "The list is painted on the glass of our window: blow-dry, cut, treatments, colour, plant-based colour, highlights. Here it is in full.",
      "v.n1": "Blow-dry",
      "v.d1": "short, medium or long; medium and long with the mask, the Davines treatment and the finish",
      "v.n2": "Cut",
      "v.d2": "women’s cut, with a blow-dry or on its own",
      "v.n3": "Colour",
      "v.d3": "colour, ammonia-free colour and plant-based colour; the toner",
      "v.n4": "Highlights",
      "v.d4": "medium and long balayage, highlights, mèches. «A personal consultation is always recommended»",
      "v.n5": "Treatments",
      "v.d5": "Olaplex and Davines; treatments for the scalp and the hair",
      "v.n6": "Face",
      "v.d6": "waxing for the face and the eyebrows",
      "v.nota": "Prices are on Treatwell and in the salon. For balayage, from our price list: «a toner is always needed».",
      "c.etichetta": "Colour",
      "c.titolo": "From red to platinum",
      "c.intro": "Some of the work that left the salon, from the photos we have posted: nearly all from behind.",
      "c.loro": "«Balayage is a perfect technique for creating delicate, natural shades and reflections, like the ones you get when the sun lightens your hair.»",
      "c.lorof": "from our Instagram, November 2024",
      "a.rosso": "Long, straight red hair down to the waist, seen from behind in the street.",
      "c.frosso": "Red, long and straight",
      "a.onde": "Long brown waves with honey highlights, from behind, on the pavement of Viale Corsica.",
      "c.fonde": "Waves with highlights, on Viale Corsica",
      "a.nero": "A sleek, glossy black bob with a fringe, seen from the side.",
      "c.fnero": "Black bob with a fringe",
      "a.rame": "Straight copper hair, from behind.",
      "c.frame": "«Rame intenso» (deep copper), from our Instagram",
      "a.biondo": "Long, wavy blonde hair, from behind, outdoors.",
      "c.fbiondo": "Wavy blonde",
      "a.caschetto": "A blonde bob with highlights, from behind, in the salon.",
      "c.fcaschetto": "Blonde bob",
      "a.ramato": "Coppery hair, layered and full at the ends, from behind under the trees.",
      "c.framato": "Coppery, layered",
      "a.castano": "Brown waves, close up.",
      "c.fcastano": "Brown waves (photo by a client)",
      "a.platino": "Straight platinum blonde hair, with a wave at the end.",
      "c.fplatino": "Platinum blonde",
      "r.etichetta": "Since the Sixties",
      "r.titolo": "Roberto, Priscilla and Anteprima",
      "r.q1": "The Sixties",
      "r.t1": "«Roberto begins his career in the best salons of Milan’s fashion district.»",
      "r.q2": "The late Seventies",
      "r.t2": "«He opens Anteprima, bringing elegance, experience and a unique vision of beauty.» On Viale Corsica, under the sign «Hair styling Anteprima by Roberto».",
      "r.q3": "Today",
      "r.t3": "The salon is a point of reference for cuts and colour. Priscilla works alongside Roberto: blow-dries, colour, balayage.",
      "r.motto": "«We love “getting our hands in your hair”… but only to make you shine!»",
      "r.mottof": "Roberto and Priscilla, from our Google listing",
      "d.etichetta": "Reviews",
      "d.titolo": "For forty years, and for a little while",
      "d.voto": "on Treatwell, 90 reviews",
      "d.s1": "Women’s cut",
      "d.s2": "Balayage",
      "d.s3": "Cut and blow-dry",
      "d.s4": "Balayage",
      "d.s5": "Blow-dry",
      "d.s6": "Colour and highlights",
      "d.t1": "Treatwell, November 2025",
      "d.t2": "Treatwell, July 2026",
      "d.t3": "Treatwell, June 2025",
      "d.t4": "Treatwell, October 2025",
      "d.t6": "Treatwell, June 2023",
      "d.nota": "From the reviews on Treatwell, in Italian, as they were written. The line about the salon, further up, is by Martina, also on Treatwell.",
      "d.tutte": "All the reviews on Treatwell",
      "o.etichetta": "Hours and where",
      "o.titolo": "Open all day, no lunch break",
      "o.cap": "Opening hours",
      "o.chiuso": "closed",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.nota": "Hours from our Google listing (October 2026), with no lunch break. Book on Treatwell or by phone.",
      "w.dove": "Where",
      "w.tram": "By tram",
      "w.tramv": "the 12 and the 27, stop Viale Corsica – Via Battistotti Sassi, about 50 metres away",
      "w.treno": "By train",
      "w.trenov": "the Passante at Porta Vittoria, about 500 metres away; the M4 at Forlanini, about 650 metres away",
      "w.tel": "Phone",
      "w.mail": "Email",
      "a.porta": "Our window on Viale Corsica: the dark sign reading «Hair styling Anteprima by Roberto», the glass door, the doormat with «Anteprima» on it.",
      "w.fporta": "Our window on Viale Corsica",
      "w.mappa": "Map: Anteprima, Viale Corsica 42/B, Milan",
      "q.etichetta": "Questions",
      "q.titolo": "Before you come",
      "q.d1": "Do I need to book?",
      "q.r1": "It’s best to: you can book on Treatwell at any time, or call 02 715754 during opening hours.",
      "q.d2": "Are you open at lunchtime?",
      "q.r2": "Yes, we are open all day: Tuesday to Friday from 9:30 to 18, Saturday from 9 to 18. Closed Sunday and Monday.",
      "q.d3": "Do you do balayage?",
      "q.r3": "Yes, medium and long balayage and highlights. As our price list says, a personal consultation is always recommended, and a toner is always needed.",
      "q.d4": "Do you have ammonia-free colour?",
      "q.r4": "Yes: besides regular colour, ammonia-free colour and plant-based colour.",
      "q.d5": "How do I get there?",
      "q.r5": "By tram: the 12 and the 27 stop about 50 metres away, on Viale Corsica at the corner of Via Battistotti Sassi. The Passante at Porta Vittoria is about 500 metres away.",
      "f2.chi": "Anteprima · De Pompeis Roberto",
      "f2.piva": "VAT no.",
      "f2.orario": "Tuesday–Friday 9:30–18 · Saturday 9–18 · open all day · closed Sunday and Monday",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · <a href=\"privacy.html\">Privacy</a> · hours from the Google listing, rating and reviews from Treatwell (October 2026); the photos from their Treatwell listing, from their Google, Facebook and Instagram pages and one by a client on Google; the texts from their pages. We redrew the column of light ourselves, like the ones in the salon.",
      "f2.su": "Back to the top"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ ANTEPRIMA · HAIR STYLING BY ROBERTO — Viale Corsica 42/B ══════════
     la FIRMA — «la colonna di luce»: la colonna verde salvia del salone con la striscia di LED a spirale; i LED si accendono dal
     pavimento al soffitto, ognuno con un guizzo, e intorno a ogni giro si accende l'alone. Il secondo modo, il boccolo: la stessa
     spirale senza la colonna, una ciocca girata sul ferro, dalla radice scura alle punte color miele, poi i riflessi del balayage.
     Lo stato è M (la colonna / il boccolo), T (0…1) e V (0 al suo posto; fino a 1 la scena scende e si spegne; da −1 a 0 arriva
     dall'alto la prossima, vuota). Senza JS e alla fine: la colonna accesa, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): i LED
     spenti. Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto
     durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[80,200,900],"via":40,"modi":[{"nome":"La colonna","fasi":{"l":[[0.03,0.12],[0.036,0.12],[0.042,0.12],[0.049,0.12],[0.055,0.12],[0.061,0.12],[0.067,0.12],[0.073,0.12],[0.08,0.12],[0.086,0.12],[0.092,0.12],[0.098,0.12],[0.104,0.12],[0.111,0.12],[0.117,0.12],[0.123,0.12],[0.129,0.12],[0.135,0.12],[0.142,0.12],[0.148,0.12],[0.154,0.12],[0.16,0.12],[0.166,0.12],[0.173,0.12],[0.179,0.12],[0.185,0.12],[0.191,0.12],[0.198,0.12],[0.204,0.12],[0.21,0.12],[0.216,0.12],[0.222,0.12],[0.229,0.12],[0.235,0.12],[0.241,0.12],[0.247,0.12],[0.253,0.12],[0.26,0.12],[0.266,0.12],[0.272,0.12],[0.278,0.12],[0.284,0.12],[0.291,0.12],[0.297,0.12],[0.303,0.12],[0.309,0.12],[0.315,0.12],[0.322,0.12],[0.328,0.12],[0.334,0.12],[0.34,0.12],[0.346,0.12],[0.353,0.12],[0.359,0.12],[0.365,0.12],[0.371,0.12],[0.377,0.12],[0.384,0.12],[0.39,0.12],[0.396,0.12],[0.402,0.12],[0.408,0.12],[0.415,0.12],[0.421,0.12],[0.427,0.12],[0.433,0.12],[0.439,0.12],[0.446,0.12],[0.452,0.12],[0.458,0.12],[0.464,0.12],[0.471,0.12],[0.477,0.12],[0.483,0.12],[0.489,0.12],[0.495,0.12],[0.502,0.12],[0.508,0.12],[0.514,0.12],[0.52,0.12],[0.526,0.12],[0.533,0.12],[0.539,0.12],[0.545,0.12],[0.551,0.12],[0.557,0.12],[0.564,0.12],[0.57,0.12],[0.576,0.12],[0.582,0.12],[0.588,0.12],[0.595,0.12],[0.601,0.12],[0.607,0.12],[0.613,0.12],[0.619,0.12],[0.626,0.12],[0.632,0.12],[0.638,0.12],[0.644,0.12],[0.65,0.12],[0.657,0.12],[0.663,0.12],[0.669,0.12],[0.675,0.12],[0.681,0.12],[0.688,0.12],[0.694,0.12],[0.7,0.12],[0.706,0.12],[0.712,0.12],[0.719,0.12],[0.725,0.12],[0.731,0.12],[0.737,0.12],[0.744,0.12],[0.75,0.12],[0.756,0.12],[0.762,0.12],[0.768,0.12],[0.775,0.12],[0.781,0.12],[0.787,0.12],[0.793,0.12],[0.799,0.12],[0.806,0.12],[0.812,0.12],[0.818,0.12],[0.824,0.12],[0.83,0.12],[0.837,0.12],[0.843,0.12],[0.849,0.12],[0.855,0.12],[0.861,0.12],[0.868,0.12],[0.874,0.12],[0.88,0.12]],"a":[[0.03,0.26166666666666666],[0.172,0.26166666666666666],[0.313,0.26166666666666666],[0.455,0.26166666666666666],[0.597,0.26166666666666666],[0.738,0.262]]}},{"nome":"Il boccolo","fasi":{"s":[[0.03,0.14],[0.038,0.14],[0.045,0.14],[0.053,0.14],[0.061,0.14],[0.069,0.14],[0.076,0.14],[0.084,0.14],[0.092,0.14],[0.1,0.14],[0.107,0.14],[0.115,0.14],[0.123,0.14],[0.131,0.14],[0.138,0.14],[0.146,0.14],[0.154,0.14],[0.162,0.14],[0.169,0.14],[0.177,0.14],[0.185,0.14],[0.193,0.14],[0.2,0.14],[0.208,0.14],[0.216,0.14],[0.224,0.14],[0.231,0.14],[0.239,0.14],[0.247,0.14],[0.255,0.14],[0.262,0.14],[0.27,0.14],[0.278,0.14],[0.286,0.14],[0.293,0.14],[0.301,0.14],[0.309,0.14],[0.317,0.14],[0.324,0.14],[0.332,0.14],[0.34,0.14],[0.348,0.14],[0.355,0.14],[0.363,0.14],[0.371,0.14],[0.379,0.14],[0.386,0.14],[0.394,0.14],[0.402,0.14],[0.41,0.14],[0.417,0.14],[0.425,0.14],[0.433,0.14],[0.441,0.14],[0.448,0.14],[0.456,0.14],[0.464,0.14],[0.472,0.14],[0.479,0.14],[0.487,0.14],[0.495,0.14],[0.503,0.14],[0.51,0.14],[0.518,0.14],[0.526,0.14],[0.534,0.14],[0.541,0.14],[0.549,0.14],[0.557,0.14],[0.565,0.14],[0.572,0.14],[0.58,0.14]],"h":[[0.62,0.12],[0.63,0.12],[0.64,0.12],[0.65,0.12],[0.66,0.12],[0.67,0.12],[0.68,0.12],[0.69,0.12],[0.7,0.12],[0.71,0.12],[0.72,0.12],[0.73,0.12],[0.74,0.12],[0.75,0.12],[0.76,0.12],[0.77,0.12],[0.78,0.12],[0.79,0.12],[0.8,0.12],[0.81,0.12],[0.82,0.12],[0.83,0.12],[0.84,0.12],[0.85,0.12],[0.86,0.12],[0.87,0.12],[0.88,0.12]]}}],"tempi":{"inizio":300,"colonna":4200,"servi":420,"arriva":480,"colonnaV":3600}};
  /* la colonna a (M, T, V) — una sola fonte: la usano _ant_firma.mjs (l'HTML allo stato finale), main.js (via ant_main.cjs) e la
     prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     La colonna verde del salone con la striscia di LED a spirale: i puntini si accendono dal pavimento al soffitto (ognuno con un
     guizzo), e intorno a ogni giro si accende l'alone. Il boccolo: la stessa spirale senza la colonna, come una ciocca girata sul
     ferro; i pezzi arrivano dalla radice alle punte, poi i riflessi del balayage. Col V la scena scende e si spegne; la prossima
     arriva dall'alto, vuota. */
  function creaColonna(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r2 = function (n) { return Math.round(n * 100) / 100; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w[0] + w[1] - 1e-9 ? 1 : c01((t - w[0]) / w[1]); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var q = function (sel) { return svg.querySelector(sel); };
    var servito = q('.servito');
    var tutti = function (cl, m, n) {
      var a = [];
      for (var k = 0; k < n; k++) a.push(q('.' + cl + '[data-m="' + m + '"][data-k="' + k + '"]'));
      return a;
    };
    var F0 = D.modi[0].fasi, F1 = D.modi[1].fasi;
    var pezzi = [
      { l: tutti('cl-l', 0, F0.l.length), a: tutti('cl-a', 0, F0.a.length), b: tutti('cl-b', 0, F0.a.length) },
      { s: tutti('cb-s', 1, F1.s.length), h: tutti('cb-h', 1, F1.h.length) }
    ];
    function disegna(m, t, v) {
      var P = pezzi[m], k, u;
      if (m === 0) {
        /* i LED: da spenti (0,3) ad accesi, col guizzo del raggio a metà della loro fase; l'alone del giro (largo e stretto) */
        for (k = 0; k < P.l.length; k++) {
          u = fase(t, F0.l[k]);
          P.l[k].setAttribute('opacity', r3(0.3 + 0.7 * dolce(u)));
          P.l[k].setAttribute('r', r2(2.3 + (u >= 1 ? 0 : 1.5 * Math.sin(Math.PI * u))));
        }
        for (k = 0; k < P.a.length; k++) {
          u = dolce(fase(t, F0.a[k]));
          P.a[k].setAttribute('opacity', r3(0.2 * u));
          P.b[k].setAttribute('opacity', r3(0.55 * u));
        }
      } else {
        /* il boccolo: i pezzi dalla radice alle punte, poi i riflessi */
        for (k = 0; k < P.s.length; k++) P.s[k].setAttribute('opacity', r3(dolce(fase(t, F1.s[k]))));
        for (k = 0; k < P.h.length; k++) P.h[k].setAttribute('opacity', r3(0.9 * dolce(fase(t, F1.h[k]))));
      }
      /* col V la scena scende e si spegne; la prossima arriva dall'alto */
      servito.setAttribute('transform', 'translate(0 ' + r1(D.via * v) + ')');
      servito.setAttribute('opacity', r3(1 - Math.abs(v)));
    }
    var completo = !!servito && pezzi.every(function (P) { return Object.keys(P).every(function (x) { return P[x].every(Boolean); }); });
    return { disegna: disegna, pezzi: pezzi, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('colonna-firma'), svgF = prendi('colonnaSvg'), leggiF = prendi('colonnaLeggi');
  var COLONNA = svgF ? creaColonna(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.colonna__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.colonna__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    COLONNA.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) COLONNA.disegna(k, 1, 0); });
    COLONNA.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta la colonna coi LED spenti */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la colonna coi LED spenti */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.colonna, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.colonna });
  }
  /* il gesto: scegliere che cosa guardare. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è,
     la scena scende e si spegne, arriva dall'alto la prossima, vuota, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.colonnaV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && COLONNA && COLONNA.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaColonna); } catch (e) {}
    window.__colonna = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__colonna.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta la colonna coi LED spenti */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__colonna.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
