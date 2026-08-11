// ── Conversie-tracking voor Google Ads ───────────────────────────────────────
// Vuurt exact op het moment van indienen (klik op "Stuur een bericht"), niet
// bij het laden van de bedankt-pagina — zo telt een toevallig/rechtstreeks
// bezoek aan /bedankt/ nooit mee. Consent Mode v2 (gtag-init.js/
// klaro-config.js) bepaalt of Google de conversie effectief mag registreren.
//
// De echte formulier-POST (Netlify) wordt uitgesteld tot de conversie is
// gemeld — met een fallback-timeout zodat het formulier ook doorgaat als
// gtag.js geblokkeerd is (ad-blocker, netwerkstoring) en de callback nooit
// komt.
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('form[name="contact"]');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        if (typeof window.gtag !== 'function') return;

        e.preventDefault();

        var submitted = false;
        function proceed() {
            if (submitted) return;
            submitted = true;
            form.submit();
        }

        window.gtag('event', 'conversion', {
            send_to: 'AW-18123102312/6mgUCN2u298cEOiw4sFD',
            value: 1.0,
            currency: 'EUR',
            event_callback: proceed
        });
        setTimeout(proceed, 1000);
    });
});
