/* ==========================================================================
   Zusammen mit the Ukraine e.V. — site behaviour
   Vanilla JS: header state, mobile nav, hero parallax, reveals, counters, data-driven projects/news
   ========================================================================== */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var prefersReducedMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var coarsePointer = window.matchMedia('(pointer: coarse)').matches;

  /* ---------- Data: projects (add more here) ---------- */
  var PROJECTS = [
    {
      id: 'edu4ua',
      title: 'EDU4UA',
      category: 'Bildung',
      accent: 'var(--blue)',
      image: 'asassets/image/digit.jpg',
      alt: 'Online-Bildung und digitales Lernen',
      featured: false
    },
    {
      id: '100x-digital',
      title: '100x Digital',
      category: 'Digital',
      accent: 'var(--ink)',
      image: 'asassets/image/DSEE.png',
      alt: 'Digitale und soziale Innovation',
      featured: true
    },
    {
      id: 'kochabende',
      title: 'Interkulturelle Kochabende',
      category: 'Community',
      accent: 'var(--coral)',
      image: 'asassets/image/UAKochabend.jpg',
      alt: 'Interkulturelle Kochabende',
      featured: false
    },
    {
      id: 'dilp',
      title: 'DILP',
      category: 'Digital',
      accent: 'var(--blue)',
      image: 'asassets/image/diva.png',
      alt: 'Digitale und soziale Innovation',
      featured: false
    }
  ];

  /* ---------- Data: news / events (add verified entries here) ---------- */
  var NEWS = [];

  /* ---------- Header: scrolled state ---------- */
  var header = document.getElementById('site-header');

  function initHeader() {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');

  function setNavOpen(open) {
    nav.classList.toggle('is-open', open);
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function initNav() {
    navToggle.addEventListener('click', function () {
      setNavOpen(!nav.classList.contains('is-open'));
    });

    nav.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (!link) return;
      setNavOpen(false);
      var hash = link.getAttribute('href');
      if (hash && hash.length > 1 && document.querySelector(hash)) {
        // smooth scroll handled by CSS scroll-behavior
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setNavOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) setNavOpen(false);
    });
  }

  /* ---------- Hero: mouse parallax ---------- */
  var heroVisual = document.getElementById('hero-visual');
  var parallaxRaf = null;

  function heroPointerTarget() {
    if (prefersReducedMotion || coarsePointer || !heroVisual) return null;
    return heroVisual;
  }

  function onHeroPointerMove(event) {
    var target = heroPointerTarget();
    if (!target) return;
    if (parallaxRaf) return;
    parallaxRaf = requestAnimationFrame(function () {
      parallaxRaf = null;
      var x = (event.clientX / window.innerWidth - 0.5) * 2;
      var y = (event.clientY / window.innerHeight - 0.5) * 2;
      target.style.setProperty('--px', (x * 140).toFixed(2) + 'px');
      target.style.setProperty('--py', (y * 90).toFixed(2) + 'px');
    });
  }

  function onHeroPointerLeave() {
    var target = heroPointerTarget();
    if (!target) return;
    if (parallaxRaf) return;
    parallaxRaf = requestAnimationFrame(function () {
      parallaxRaf = null;
      target.style.setProperty('--px', '0px');
      target.style.setProperty('--py', '0px');
    });
  }

  function initHeroParallax() {
    if (!heroVisual) return;
    heroVisual.addEventListener('mousemove', onHeroPointerMove, { passive: true });
    heroVisual.addEventListener('mouseleave', onHeroPointerLeave);
    heroVisual.addEventListener('touchstart', function () {
      heroVisual.style.setProperty('--px', '0px');
      heroVisual.style.setProperty('--py', '0px');
    }, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveals() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  /* ---------- Count-up ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (prefersReducedMotion || !('IntersectionObserver' in window) || !counters.length) return;

    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var duration = 1600;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var value = target * eased;
        el.textContent = value.toFixed(decimals).replace('.', ',') + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Projects: data-driven rendering ---------- */
  function projectCardMarkup(p) {
    var onAccent = (p.accent === 'var(--yellow)') ? 'var(--ink)' : 'var(--white)';
    return (
      '<article class="project-card' + (p.featured ? ' project-card--featured' : '') + '" style="--accent: ' + p.accent + '; --on-accent: ' + onAccent + ';">' +
        '<div class="project-card__media">' +
          '<img src="' + p.image + '" alt="' + p.alt + '" loading="lazy" decoding="async" width="800" height="1000">' +
        '</div>' +
        '<div class="project-card__body">' +
          '<p class="project-card__kicker">' + p.category + '</p>' +
          '<h3 class="project-card__title">' + p.title + '</h3>' +
        '</div>' +
      '</article>'
    );
  }

  function initProjects() {
    var grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = PROJECTS.map(projectCardMarkup).join('');
  }

  /* ---------- News / events: data-driven rendering ---------- */
  function initNews() {
    var list = document.getElementById('news-list');
    if (!list) return;
    if (!NEWS.length) {
      list.innerHTML = '<p class="news__empty">Aktuelle Neuigkeiten und Termine werden hier veröffentlicht.</p>';
      return;
    }
    list.innerHTML = NEWS.map(function (item) {
      return '<article class="news-item">' +
        '<p class="news-item__date">' + item.date + '</p>' +
        '<div class="news-item__body">' +
          '<h3 class="news-item__title">' + item.title + '</h3>' +
          '<p class="news-item__text">' + item.text + '</p>' +
        '</div>' +
        '<div class="news-item__media"><img src="' + item.image + '" alt="' + item.alt + '" loading="lazy" decoding="async"></div>' +
      '</article>';
    }).join('');
  }

  /* ---------- Footer year ---------- */
  function initFooterYear() {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Init ---------- */
  function init() {
    initHeader();
    initNav();
    initHeroParallax();
    initReveals();
    initCounters();
    initProjects();
    initNews();
    initFooterYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ---------- Reduced motion preference change ---------- */
  prefersReducedMotionMQ.addEventListener('change', function (event) {
    if (event.matches) {
      // reset transforms for reduced motion
      if (heroVisual) {
        heroVisual.style.setProperty('--px', '0px');
        heroVisual.style.setProperty('--py', '0px');
      }
    }
  });
})();
