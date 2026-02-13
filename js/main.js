/* ============================================
   PCA DEMS - Main JavaScript
   Handles all interactive behavior
   ============================================ */

(function() {
  'use strict';

  /* --- Alert Bar Dismiss --- */
  function initAlertBar() {
    var alertBar = document.getElementById('alertBar');
    if (!alertBar) return;

    var alertId = alertBar.getAttribute('data-alert-id') || 'default';
    var storageKey = 'pcadems-alert-dismissed-' + alertId;

    // Check if previously dismissed
    if (localStorage.getItem(storageKey) === 'true') {
      alertBar.classList.add('is-hidden');
      return;
    }

    var closeBtn = alertBar.querySelector('.alert-bar__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        alertBar.classList.add('is-hidden');
        localStorage.setItem(storageKey, 'true');
      });
    }
  }

  /* --- Mobile Navigation --- */
  function initMobileNav() {
    var hamburger = document.getElementById('hamburgerBtn');
    var mobileNav = document.getElementById('mobileNav');
    var overlay = document.getElementById('mobileNavOverlay');
    var closeBtn = document.getElementById('mobileNavClose');

    if (!hamburger || !mobileNav) return;

    function openNav() {
      mobileNav.classList.add('is-open');
      if (overlay) overlay.classList.add('is-visible');
      document.body.classList.add('nav-open');
    }

    function closeNav() {
      mobileNav.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-visible');
      document.body.classList.remove('nav-open');
    }

    hamburger.addEventListener('click', openNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    if (overlay) overlay.addEventListener('click', closeNav);

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        closeNav();
      }
    });
  }

  /* --- Sticky Header --- */
  function initStickyHeader() {
    var header = document.getElementById('siteHeader');
    if (!header) return;

    var scrollThreshold = 10;

    function onScroll() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Check initial state
  }

  /* --- Active Nav Highlighting --- */
  function initActiveNav() {
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Desktop nav
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('is-active');
      }
    });

    // Mobile nav
    var mobileLinks = document.querySelectorAll('.mobile-nav__link');
    mobileLinks.forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('is-active');
      }
    });
  }

  /* --- Smooth Scroll for Anchor Links --- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href').slice(1);
        if (!targetId) return;

        var target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          var headerHeight = document.getElementById('siteHeader')
            ? document.getElementById('siteHeader').offsetHeight
            : 0;
          var top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* --- Newsletter Form Mock --- */
  function initNewsletterForms() {
    var forms = document.querySelectorAll('[data-newsletter-form]');
    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        if (!input || !input.value) return;

        // Simple validation
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          input.style.borderColor = 'var(--color-accent-red)';
          return;
        }

        // Show success message
        var success = form.parentElement.querySelector('.signup__success');
        if (success) {
          form.style.display = 'none';
          success.classList.add('is-visible');
        } else {
          input.value = '';
          input.placeholder = 'Thanks for subscribing!';
          input.disabled = true;
          var btn = form.querySelector('button');
          if (btn) {
            btn.textContent = '\u2713';
            btn.disabled = true;
          }
        }
      });
    });

    // Also handle footer signup forms
    var footerForms = document.querySelectorAll('.footer__signup');
    footerForms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        if (!input || !input.value) return;

        input.value = '';
        input.placeholder = 'Subscribed!';
        input.disabled = true;
        var btn = form.querySelector('button');
        if (btn) {
          btn.textContent = '\u2713';
          btn.disabled = true;
        }
      });
    });
  }

  /* --- Lazy Loading Images --- */
  function initLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    var lazyImages = document.querySelectorAll('img[data-src]');
    if (!lazyImages.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px'
    });

    lazyImages.forEach(function(img) {
      observer.observe(img);
    });
  }

  /* --- Initialize Everything --- */
  document.addEventListener('DOMContentLoaded', function() {
    initAlertBar();
    initMobileNav();
    initStickyHeader();
    initActiveNav();
    initSmoothScroll();
    initNewsletterForms();
    initLazyLoading();
  });

})();
