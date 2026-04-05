(function () {
    'use strict';

    var main = document.getElementById('post-main');

    function getSlug() {
        var params = new URLSearchParams(window.location.search);
        return params.get('slug') || '';
    }

    function parseFrontmatter(raw) {
        var match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
        if (!match) return { meta: {}, body: raw.trim() };

        var meta = {};
        var lines = match[1].split('\n');
        var i = 0;

        while (i < lines.length) {
            var separatorIndex = lines[i].indexOf(':');
            if (separatorIndex === -1) { i++; continue; }

            var key = lines[i].slice(0, separatorIndex).trim();
            var value = lines[i].slice(separatorIndex + 1).trim();

            // Handle YAML block scalar (> or |)
            if (value === '>' || value === '|') {
                var blockLines = [];
                i++;
                while (i < lines.length && (lines[i].startsWith('  ') || lines[i].trim() === '')) {
                    blockLines.push(lines[i].trim());
                    i++;
                }
                meta[key] = blockLines.filter(Boolean).join(' ');
                continue;
            }

            value = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
            meta[key] = value;
            i++;
        }

        var body = raw.slice(match[0].length).trim();
        return { meta: meta, body: body };
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        var date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return '';
        return new Intl.DateTimeFormat('nl-BE', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderPost(slug, raw) {
        var parsed = parseFrontmatter(raw);
        var meta = parsed.meta;
        var body = parsed.body;

        var title = meta.title || 'Zonder titel';
        var dateStr = formatDate(meta.date);
        var category = meta.category || 'Blog';
        var image = meta.image || '';

        document.title = title + ' — De Tussenruimte';
        var descEl = document.getElementById('page-description');
        if (descEl) descEl.setAttribute('content', meta.excerpt || '');

        var imageHtml = image
            ? '<div class="post-hero__image"><img src="' + escapeHtml(image) + '" alt="' + escapeHtml(title) + '"></div>'
            : '';

        var bodyHtml = typeof marked !== 'undefined'
            ? marked.parse(body)
            : '<p>' + escapeHtml(body).replace(/\n\n/g, '</p><p>') + '</p>';

        main.innerHTML = [
            '<header class="post-hero">',
            '  <p class="post-hero__label">' + escapeHtml(category) + '</p>',
            '  <h1 class="post-hero__title">' + escapeHtml(title) + '</h1>',
            '  <div class="post-hero__meta">',
            '    <span>' + escapeHtml(dateStr) + '</span>',
            '  </div>',
            '</header>',
            imageHtml,
            '<article class="post-body">',
            '  <a href="/blog/" class="post-back">Terug naar blog</a>',
            bodyHtml,
            '</article>'
        ].join('');
    }

    function showError() {
        main.innerHTML = [
            '<div style="text-align:center;padding:6rem 1rem;">',
            '  <p class="section__body">Dit artikel kon niet worden geladen.</p>',
            '  <a href="/blog/" class="post-back" style="display:inline-flex;margin-top:1.5rem;">Terug naar blog</a>',
            '</div>'
        ].join('');
    }

    var slug = getSlug();
    if (!slug) {
        showError();
        return;
    }

    fetch('/blog/posts/' + encodeURIComponent(slug) + '.md', { cache: 'no-store' })
        .then(function (response) {
            if (!response.ok) throw new Error('not found');
            return response.text();
        })
        .then(function (raw) {
            renderPost(slug, raw);
        })
        .catch(showError);
}());
