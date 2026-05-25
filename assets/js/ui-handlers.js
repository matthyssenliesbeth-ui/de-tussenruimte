document.addEventListener('click', function (e) {
    var target = e.target.closest('[data-klaro-show]');
    if (target) {
        e.preventDefault();
        if (typeof klaro !== 'undefined') klaro.show();
        return;
    }

    var calendly = e.target.closest('[data-calendly-open]');
    if (calendly) {
        e.preventDefault();
        if (typeof window._openCalendlyWithConsent === 'function') {
            window._openCalendlyWithConsent(e);
        }
    }
});
