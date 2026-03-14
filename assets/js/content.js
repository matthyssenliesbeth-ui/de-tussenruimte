(function () {
    'use strict';

    function setText(selector, value) {
        if (!value) return;
        var element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    }

    function setHtml(selector, value) {
        if (!value) return;
        var element = document.querySelector(selector);
        if (element) {
            element.innerHTML = value;
        }
    }

    function setAttr(selector, attribute, value) {
        if (!value) return;
        var element = document.querySelector(selector);
        if (element) {
            element.setAttribute(attribute, value);
        }
    }

    fetch('/content/site.json', { cache: 'no-store' })
        .then(function (response) {
            if (!response.ok) return null;
            return response.json();
        })
        .then(function (content) {
            if (!content) return;

            setText('[data-cms="home.hero.eyebrow"]', content.homeHeroEyebrow);
            setHtml('[data-cms="home.hero.title"]', content.homeHeroTitleHtml);
            setText('[data-cms="home.hero.intro"]', content.homeHeroIntro);
            setText('[data-cms="home.hero.primary.text"]', content.homeHeroPrimaryText);
            setAttr('[data-cms="home.hero.primary.text"]', 'href', content.homeHeroPrimaryHref);
            setText('[data-cms="home.hero.secondary.text"]', content.homeHeroSecondaryText);
            setAttr('[data-cms="home.hero.secondary.text"]', 'href', content.homeHeroSecondaryHref);
            setAttr('[data-cms="home.retraite.image"]', 'src', content.homeRetreatImageSrc);
            setAttr('[data-cms="home.retraite.image"]', 'alt', content.homeRetreatImageAlt);

            setText('[data-cms="blog.hero.label"]', content.blogHeroLabel);
            setText('[data-cms="blog.hero.title"]', content.blogHeroTitle);
            setText('[data-cms="blog.hero.intro"]', content.blogHeroIntro);
            setText('[data-cms="blog.newsletter.title"]', content.blogNewsletterTitle);
            setText('[data-cms="blog.newsletter.text"]', content.blogNewsletterText);
        })
        .catch(function () {
            // Stil falen: pagina werkt met default inhoud.
        });
}());
