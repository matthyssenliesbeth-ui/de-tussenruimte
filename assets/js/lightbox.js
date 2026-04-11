/**
 * Lightbox / carrousel voor de retraite foto-grid
 * Gebruik: voeg data-lightbox="groepnaam" toe aan <a> rondom foto's
 */
(function () {
    'use strict';

    var images   = [];   // alle foto's in de groep
    var current  = 0;
    var overlay, imgEl, counter, prevBtn, nextBtn;

    function build() {
        overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Foto\'s retraiteruimte');

        var inner = document.createElement('div');
        inner.className = 'lightbox-inner';

        imgEl = document.createElement('img');
        imgEl.className = 'lightbox-img';
        imgEl.alt = '';

        prevBtn = document.createElement('button');
        prevBtn.className = 'lightbox-btn lightbox-btn--prev';
        prevBtn.setAttribute('aria-label', 'Vorige foto');
        prevBtn.innerHTML = '&#8592;';

        nextBtn = document.createElement('button');
        nextBtn.className = 'lightbox-btn lightbox-btn--next';
        nextBtn.setAttribute('aria-label', 'Volgende foto');
        nextBtn.innerHTML = '&#8594;';

        var closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-btn lightbox-btn--close';
        closeBtn.setAttribute('aria-label', 'Sluiten');
        closeBtn.innerHTML = '&#215;';

        counter = document.createElement('span');
        counter.className = 'lightbox-counter';

        inner.append(imgEl, prevBtn, nextBtn, closeBtn, counter);
        overlay.appendChild(inner);
        document.body.appendChild(overlay);

        closeBtn.addEventListener('click', close);
        prevBtn.addEventListener('click', function () { go(current - 1); });
        nextBtn.addEventListener('click', function () { go(current + 1); });

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) close();
        });

        document.addEventListener('keydown', function (e) {
            if (!overlay.classList.contains('is-open')) return;
            if (e.key === 'ArrowLeft')  go(current - 1);
            if (e.key === 'ArrowRight') go(current + 1);
            if (e.key === 'Escape')     close();
        });
    }

    function open(index) {
        current = index;
        render();
        overlay.classList.add('is-open');
        document.body.classList.add('lightbox-open');
        overlay.querySelector('.lightbox-btn--close').focus();
    }

    function close() {
        overlay.classList.remove('is-open');
        document.body.classList.remove('lightbox-open');
    }

    function go(index) {
        current = (index + images.length) % images.length;
        render();
    }

    function render() {
        var item = images[current];
        imgEl.src = item.src;
        imgEl.alt = item.alt;
        counter.textContent = (current + 1) + ' / ' + images.length;
        prevBtn.style.visibility = images.length > 1 ? 'visible' : 'hidden';
        nextBtn.style.visibility = images.length > 1 ? 'visible' : 'hidden';
    }

    function init() {
        var triggers = document.querySelectorAll('[data-lightbox]');
        if (!triggers.length) return;

        build();

        triggers.forEach(function (trigger, idx) {
            var img = trigger.querySelector('img');
            images.push({
                src: trigger.href || (img && img.src) || '',
                alt: img ? (img.alt || '') : ''
            });

            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                open(idx);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
