// ── Conversie-tracking voor Google Ads ───────────────────────────────────────
// Dit bestand wordt altijd geladen; Consent Mode v2 (zie gtag-init.js en
// klaro-config.js) bepaalt of Google de conversie effectief mag registreren
// op basis van de toestemming die de gebruiker via Klaro heeft gegeven.
// ─────────────────────────────────────────────────────────────────────────────

var GTAG_AFSPRAAK_ID = 'AW-18123102312/04TtCJnc7awcEOiw4sFD'; // Afspraak maken (Calendly)
var GTAG_LEADFORM_ID = 'AW-18123102312/6mgUCN2u298cEOiw4sFD'; // Leadformulier indienen (contactformulier)

// 1. Calendly: afspraak geboekt via de popup
window.addEventListener('message', function(e) {
    if (e.origin !== 'https://calendly.com') return;
    if (e.data && e.data.event === 'calendly.event_scheduled') {
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {send_to: GTAG_AFSPRAAK_ID});
        }
    }
});

// 2. Contactformulier: gebruiker is op de bedankt-pagina beland ná een
//    echte formulier-indiening (token gezet door ui-handlers.js vlak vóór
//    de POST). Zonder token — bv. rechtstreeks bezoek, bookmark, gedeelde
//    link — telt het bezoek niet als conversie. Token wordt meteen gewist
//    zodat een refresh niet dubbel telt.
if (window.location.pathname.indexOf('/bedankt') !== -1) {
    if (sessionStorage.getItem('detr_form_submitted') === '1') {
        sessionStorage.removeItem('detr_form_submitted');
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {send_to: GTAG_LEADFORM_ID});
        }
    }
}
