// Zet een eenmalig token vlak vóór de echte formulier-POST, zodat
// conversie.js op /bedankt/ kan onderscheiden "kwam via het formulier"
// van een toevallig/rechtstreeks bezoek aan die URL (zie conversie.js).
document.addEventListener('submit', function (e) {
    if (e.target && e.target.name === 'contact') {
        sessionStorage.setItem('detr_form_submitted', '1');
    }
});

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
