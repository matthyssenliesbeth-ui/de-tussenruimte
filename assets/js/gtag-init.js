window.dataLayer = window.dataLayer || [];
window.gtag = function(){window.dataLayer.push(arguments);};

// Consent Mode v2 — standaard geweigerd tot Klaro toestemming doorgeeft.
// Zo blijft de Google-tag zelf altijd zichtbaar/actief (nodig voor Google's
// eigen tag-detectie), zonder dat er cookies/gegevens verstuurd worden
// zonder toestemming.
window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
});

window.gtag('js', new Date());
window.gtag('config', 'AW-18123102312');
