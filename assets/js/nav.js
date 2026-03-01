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
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
        menu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    // Menu sluiten bij klik op een link (anchor-navigatie op één-pager)
    menu.querySelectorAll('.site-nav__mobile-link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // Menu sluiten bij Escape-toets
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) {
            closeMenu();
            toggle.focus();
        }
    });
}());
