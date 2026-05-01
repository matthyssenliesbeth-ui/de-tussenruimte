(function () {
    'use strict';

    /* ── DOM helpers ──────────────────────────────────────────────────────── */
    function setText(sel, val) {
        if (!val) return;
        var el = document.querySelector(sel);
        if (el) el.textContent = val;
    }
    function setHtml(sel, val) {
        if (!val) return;
        var el = document.querySelector(sel);
        if (el) el.innerHTML = val;
    }
    function setAttr(sel, attr, val) {
        if (!val) return;
        var el = document.querySelector(sel);
        if (el) el.setAttribute(attr, val);
    }
    function esc(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* ── Carousel ─────────────────────────────────────────────────────────── */
    function initCarousel(carousel) {
        var track   = carousel.querySelector('.testimonial-carousel__track');
        var current = 0;

        function cards()  { return track ? track.querySelectorAll(':scope > *') : []; }
        function dots()   { return carousel.querySelectorAll('.testimonial-carousel__dot'); }

        function goTo(n) {
            var c = cards();
            if (!c.length) return;
            current = ((n % c.length) + c.length) % c.length;
            if (track) track.style.transform = 'translateX(-' + current * 100 + '%)';
            dots().forEach(function (d, i) {
                d.classList.toggle('testimonial-carousel__dot--active', i === current);
            });
        }

        carousel.querySelectorAll('.testimonial-carousel__btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                goTo(current + parseInt(btn.dataset.dir, 10));
            });
        });

        carousel.addEventListener('click', function (e) {
            var dot = e.target.closest('.testimonial-carousel__dot');
            if (!dot) return;
            var allDots = Array.from(dots());
            goTo(allDots.indexOf(dot));
        });
    }

    /* ── Reviews injection ────────────────────────────────────────────────── */
    function injectReviews(reviews) {
        /* 1. Homepage carousel */
        var track = document.querySelector('.testimonial-carousel__track');
        if (track && reviews.length) {
            track.innerHTML = reviews.map(function (r) {
                return '<a href="ervaringen/" class="testimonial-card">'
                    + '<p class="testimonial-card__quote">' + esc(r.citaat) + '</p>'
                    + '<span class="testimonial-card__author">— ' + esc(r.naam) + ', ' + esc(r.dienst) + '</span>'
                    + '</a>';
            }).join('');

            var dotsEl = document.querySelector('.testimonial-carousel__dots');
            if (dotsEl) {
                dotsEl.innerHTML = reviews.map(function (_, i) {
                    return '<button class="testimonial-carousel__dot'
                        + (i === 0 ? ' testimonial-carousel__dot--active' : '')
                        + '" aria-label="Review ' + (i + 1) + '"></button>';
                }).join('');
            }

            var carousel = document.querySelector('.testimonial-carousel');
            if (carousel) initCarousel(carousel);
        }

        /* 2. Ervaringen pagina */
        var container = document.querySelector('[data-reviews-container]');
        if (container && reviews.length) {
            container.innerHTML = reviews.map(function (r) {
                var paras = r.tekst.split(/\n\n+/).filter(Boolean)
                    .map(function (p) { return '<p>' + esc(p.trim()) + '</p>'; }).join('\n');
                return '<article class="review-entry">'
                    + '<p class="review-entry__label">' + esc(r.dienst) + '</p>'
                    + '<h2 class="review-entry__name">' + esc(r.naam) + '</h2>'
                    + '<span class="review-entry__quote-mark" aria-hidden="true">"</span>'
                    + '<blockquote class="review-entry__body">' + paras + '</blockquote>'
                    + '</article>';
            }).join('\n');
        }
    }

    /* ── Site.json injection ──────────────────────────────────────────────── */
    function injectSite(c) {
        /* Homepage hero */
        setText('[data-cms="home.hero.eyebrow"]',          c.homeHeroEyebrow);
        setHtml('[data-cms="home.hero.title"]',             c.homeHeroTitleHtml);
        setText('[data-cms="home.hero.intro"]',             c.homeHeroIntro);
        setText('[data-cms="home.hero.primary.text"]',      c.homeHeroPrimaryText);
        setAttr('[data-cms="home.hero.primary.text"]',  'href', c.homeHeroPrimaryHref);
        setText('[data-cms="home.hero.secondary.text"]',    c.homeHeroSecondaryText);
        setAttr('[data-cms="home.hero.secondary.text"]','href', c.homeHeroSecondaryHref);
        setAttr('[data-cms="home.retraite.image"]',    'src',   c.homeRetreatImageSrc);
        setAttr('[data-cms="home.retraite.image"]',    'alt',   c.homeRetreatImageAlt);
        /* Blog page */
        setText('[data-cms="blog.hero.label"]',      c.blogHeroLabel);
        setText('[data-cms="blog.hero.title"]',      c.blogHeroTitle);
        setText('[data-cms="blog.hero.intro"]',      c.blogHeroIntro);
        setText('[data-cms="blog.newsletter.title"]', c.blogNewsletterTitle);
        setText('[data-cms="blog.newsletter.text"]',  c.blogNewsletterText);
        /* Over mij */
        setText('[data-cms="over.tekst.1"]', c.overMijTekst1);
        setText('[data-cms="over.tekst.2"]', c.overMijTekst2);
        setText('[data-cms="over.tekst.3"]', c.overMijTekst3);
        setText('[data-cms="over.tekst.4"]', c.overMijTekst4);
        setText('[data-cms="over.tekst.5"]', c.overMijTekst5);
        setText('[data-cms="over.tekst.6"]', c.overMijTekst6);
    }

    /* ── Coaching.json injection ──────────────────────────────────────────── */
    function injectCoaching(c) {
        setText('[data-cms="life.intro.1"]',       c.lifeIntro1);
        setText('[data-cms="life.intro.2"]',       c.lifeIntro2);
        setText('[data-cms="life.intro.3"]',       c.lifeIntro3);
        setText('[data-cms="loopbaan.intro.1"]',   c.loopbaanIntro1);
        setText('[data-cms="loopbaan.intro.2"]',   c.loopbaanIntro2);
        setText('[data-cms="loopbaan.intro.3"]',   c.loopbaanIntro3);
        setText('[data-cms="ondernemer.intro.1"]', c.ondernemerIntro1);
        setText('[data-cms="ondernemer.intro.2"]', c.ondernemerIntro2);
        setText('[data-cms="ondernemer.intro.3"]', c.ondernemerIntro3);
    }

    /* ── Fetch helper ─────────────────────────────────────────────────────── */
    function fetchJson(url) {
        return fetch(url, { cache: 'no-store' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .catch(function () { return null; });
    }

    /* ── Bootstrap ────────────────────────────────────────────────────────── */
    Promise.all([
        fetchJson('/content/site.json'),
        fetchJson('/content/reviews.json'),
        fetchJson('/content/coaching.json')
    ]).then(function (results) {
        if (results[0]) injectSite(results[0]);
        if (results[1] && results[1].reviews) injectReviews(results[1].reviews);
        if (results[2]) injectCoaching(results[2]);
    });

    /* Fallback carousel init for static HTML (when fetch is not needed / fails) */
    document.addEventListener('DOMContentLoaded', function () {
        if (!document.querySelector('.testimonial-carousel__track a')) {
            document.querySelectorAll('.testimonial-carousel').forEach(initCarousel);
        }
    });

}());
