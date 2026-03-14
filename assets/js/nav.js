/**
 * Navigatie-gedrag
 *  1. Transparant → solid achtergrond na scrollen
 *  2. Hamburger-menu toggle op mobiel
 */
(function () {
    'use strict';

    const nav    = document.querySelector('.site-nav');
    const toggle = document.querySelector('.site-nav__toggle');
    const menu   = document.querySelector('.site-nav__mobile-menu');

    if (!nav) return;

    // ── Scroll: voeg .is-scrolled toe zodra de pagina scrollt ────────────────
    function syncScrollState() {
        nav.classList.toggle('is-scrolled', window.scrollY > 40);
    }

    window.addEventListener('scroll', syncScrollState, { passive: true });
    syncScrollState(); // direct uitvoeren zodat de state klopt bij pageload/refresh

    // ── Hamburger-menu toggle ────────────────────────────────────────────────
    if (!toggle || !menu) return;

    function openMenu() {
        menu.classList.add('is-open');
        toggle.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }

    toggle.addEventListener('click', function () {
        menu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    // Menu sluiten bij klik op een link (anchor-navigatie op één-pager)
    menu.querySelectorAll('.site-nav__mobile-link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // ── Sticky-stack anchor fix ──────────────────────────────────────────────
    // De browser berekent scroll-doelen voor position:sticky verkeerd.
    // We onderscheppen alle anchor-links en scrollen manueel naar offsetTop.
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id     = this.getAttribute('href').slice(1);
            var target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        });
    });

    // Menu sluiten bij Escape-toets
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) {
            closeMenu();
            toggle.focus();
        }
    });

    // ── Lokale dev-fallback voor Netlify form submit ───────────────────────
    // Live Server ondersteunt geen POST naar statische routes (geeft 405).
    // Op localhost sturen we daarom na submit direct door naar de bedankpagina.
    var isLocalHost = /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
    var contactForm = document.querySelector('form[name="contact"]');

    if (isLocalHost && contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            window.location.href = 'bedankt/';
        });
    }
}());
