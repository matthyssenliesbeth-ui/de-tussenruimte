var klaroConfig = {
    version: 1,
    elementID: 'klaro',
    storageMethod: 'cookie',
    cookieName: 'klaro',
    cookieExpiresAfterDays: 365,
    htmlTexts: false,
    embedded: false,
    groupByPurpose: true,
    lang: 'nl',
    privacyPolicy: {default: '/privacybeleid/'},

    translations: {
        nl: {
            consentModal: {
                title: 'Cookie-instellingen',
                description: 'Hieronder zie je welke externe diensten deze website gebruikt. Je kan per dienst kiezen of je ze aanvaardt.',
            },
            consentNotice: {
                description: 'Deze website gebruikt cookies voor het meten van advertentie-effectiviteit (Google Ads). Lees meer in ons {privacyPolicy}.',
                learnMore: 'Cookie-instellingen',
            },
            acceptAll: 'Alles aanvaarden',
            acceptSelected: 'Selectie opslaan',
            decline: 'Weigeren',
            close: 'Sluiten',
            privacyPolicy: {
                text: '{privacyPolicy}',
                name: 'privacybeleid',
            },
            purposeItem: {
                service: 'dienst',
                services: 'diensten',
            },
            purposes: {
                marketing: {
                    title: 'Marketing',
                    description: 'Cookies voor het meten van advertentie-effectiviteit.',
                },
                functional: {
                    title: 'Functioneel',
                    description: 'Cookies voor externe widgets (zoals de agenda).',
                },
            },
        },
    },

    callback: function(consent, service) {
        if (service.name === 'google-ads' && typeof window.gtag === 'function') {
            var state = consent ? 'granted' : 'denied';
            window.gtag('consent', 'update', {
                ad_storage: state,
                ad_user_data: state,
                ad_personalization: state
            });
        }
        if (service.name === 'calendly' && consent && window._pendingCalendly) {
            window._pendingCalendly = false;
            if (typeof Calendly !== 'undefined') {
                setTimeout(function() {
                    Calendly.initPopupWidget({url: 'https://calendly.com/liesbeth-de-tussenruimte'});
                }, 400);
            }
        }
    },

    services: [
        {
            name: 'google-ads',
            title: 'Google Ads',
            purposes: ['marketing'],
            required: false,
            optOut: false,
            onlyOnce: true,
            translations: {
                nl: {
                    title: 'Google Ads',
                    description: 'Meet de effectiviteit van advertentiecampagnes. Plaatst cookies zoals _gcl_au. Gegevens gaan naar Google (VS) onder het EU-US Data Privacy Framework.',
                },
            },
        },
        {
            name: 'calendly',
            title: 'Calendly',
            purposes: ['functional'],
            required: false,
            onlyOnce: false,
            translations: {
                nl: {
                    title: 'Calendly (agenda)',
                    description: 'Externe agenda-service om een gesprek in te plannen. Verwerkt browsergegevens bij gebruik van het agendawidget.',
                },
            },
        },
    ],
};

window._openCalendlyWithConsent = function(e) {
    e.preventDefault();
    if (typeof klaro === 'undefined') {
        if (typeof Calendly !== 'undefined') {
            Calendly.initPopupWidget({url: 'https://calendly.com/liesbeth-de-tussenruimte'});
        }
        return;
    }
    var manager = klaro.getManager();
    if (manager && manager.getConsent('calendly')) {
        if (typeof Calendly !== 'undefined') {
            Calendly.initPopupWidget({url: 'https://calendly.com/liesbeth-de-tussenruimte'});
        }
    } else {
        window._pendingCalendly = true;
        klaro.show();
    }
};
