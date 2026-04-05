(function () {
    'use strict';

    var grid = document.getElementById('blog-articles');
    if (!grid) return;

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function normalizeUrl(url) {
        if (!url) return '';
        if (/^https?:\/\//i.test(url) || /^\/\//.test(url)) return url;
        if (url.charAt(0) === '/') return url;
        return '/' + url.replace(/^\.\/?/, '');
    }

    function formatMonthYear(dateString) {
        if (!dateString) return 'Onbekende datum';
        var date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return 'Onbekende datum';
        return new Intl.DateTimeFormat('nl-BE', {
            month: 'long',
            year: 'numeric'
        }).format(date);
    }

    function renderPosts(posts) {
        if (!Array.isArray(posts) || posts.length === 0) {
            grid.innerHTML = '<p class="section__body">Nog geen artikels gepubliceerd.</p>';
            return;
        }

        var markup = posts.map(function (post, index) {
            var image = normalizeUrl(post.image || 'assets/Images/valiphotos-road-1072823.jpg');
            var featured = index === 0;
            var cardClass = featured ? 'article-card article-card--featured' : 'article-card';
            var linkClass = featured ? 'article-card-link article-card-link--featured' : 'article-card-link';
            var url = '/blog/post/?slug=' + encodeURIComponent(post.slug || '');

            return [
                '<a href="' + escapeHtml(url) + '" class="' + linkClass + '">',
                '  <article class="' + cardClass + '">',
                '    <div class="article-card__image">',
                '      <img src="' + escapeHtml(image) + '" alt="' + escapeHtml(post.title || 'Blog afbeelding') + '" loading="lazy">',
                '    </div>',
                '    <div class="article-card__body">',
                '      <div class="article-card__meta">',
                '        <span class="article-card__category">' + escapeHtml(post.category || 'Blog') + '</span>',
                '        <span class="article-card__date">' + escapeHtml(formatMonthYear(post.date)) + '</span>',
                '      </div>',
                '      <h3 class="article-card__title">' + escapeHtml(post.title || 'Zonder titel') + '</h3>',
                '      <p class="article-card__excerpt">' + escapeHtml(post.excerpt || '') + '</p>',
                '      <span class="article-card__readmore">Lees meer</span>',
                '    </div>',
                '  </article>',
                '</a>'
            ].join('');
        }).join('');

        grid.innerHTML = markup;
    }

    fetch('/assets/data/blog-posts.json', { cache: 'no-store' })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Kon blog-data niet laden');
            }
            return response.json();
        })
        .then(renderPosts)
        .catch(function () {
            grid.innerHTML = '<p class="section__body">Kon artikels niet laden. Probeer later opnieuw.</p>';
        });
}());
