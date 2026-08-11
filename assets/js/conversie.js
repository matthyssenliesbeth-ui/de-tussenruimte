// ── Conversie-tracking voor Google Ads ───────────────────────────────────────
// Dit bestand wordt altijd geladen; Consent Mode v2 (zie gtag-init.js en
// klaro-config.js) bepaalt of Google de conversie effectief mag registreren
// op basis van de toestemming die de gebruiker via Klaro heeft gegeven.
// ─────────────────────────────────────────────────────────────────────────────

var GTAG_LEADFORM_ID = 'AW-18123102312/6mgUCN2u298cEOiw4sFD'; // Leadformulier indienen (contactformulier)

// Contactformulier: gebruiker is op de bedankt-pagina beland ná een echte
// formulier-indiening (token gezet door ui-handlers.js vlak vóór de POST).
// Zonder token — bv. rechtstreeks bezoek, bookmark, gedeelde link — telt
// het bezoek niet als conversie. Token wordt meteen gewist zodat een
// refresh niet dubbel telt.
if (window.location.pathname.indexOf('/bedankt') !== -1) {
    if (sessionStorage.getItem('detr_form_submitted') === '1') {
        sessionStorage.removeItem('detr_form_submitted');
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {send_to: GTAG_LEADFORM_ID});
        }
    }
}
