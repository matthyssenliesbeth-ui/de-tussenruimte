// ── Conversie-tracking voor Google Ads ───────────────────────────────────────
// Dit bestand wordt enkel geladen nadat de gebruiker toestemming heeft gegeven
// voor marketing-cookies via Klaro (data-name="google-ads").
//
// VERVANG 'CONVERSION_LABEL_HIER' door het label uit Google Ads:
// Google Ads → Doelen → Conversies → [jouw actie] → Tag-instelling
// Het label is het deel na de slash: AW-18123102312/XXXXX
// ─────────────────────────────────────────────────────────────────────────────

var GTAG_CONVERSIE_ID = 'AW-18123102312/CONVERSION_LABEL_HIER';

// 1. Calendly: afspraak geboekt via de popup
window.addEventListener('message', function(e) {
    if (e.origin !== 'https://calendly.com') return;
    if (e.data && e.data.event === 'calendly.event_scheduled') {
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {send_to: GTAG_CONVERSIE_ID});
        }
    }
});

// 2. Contactformulier: gebruiker is op de bedankt-pagina beland
if (window.location.pathname.replace(/\/$/, '').split('/').pop() === 'bedankt' ||
    window.location.pathname.indexOf('/bedankt') !== -1) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {send_to: GTAG_CONVERSIE_ID});
    }
}
