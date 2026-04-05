#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const postsDir = path.join(rootDir, 'blog', 'posts');
const outputDir = path.join(rootDir, 'assets', 'data');
const outputFile = path.join(outputDir, 'blog-posts.json');

// ── Frontmatter parser ───────────────────────────────────────────────────────

function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return { meta: {}, body: fileContent.trim() };
  }

  const meta = {};
  const rawMeta = match[1].split('\n');
  let i = 0;

  while (i < rawMeta.length) {
    const separatorIndex = rawMeta[i].indexOf(':');
    if (separatorIndex === -1) { i++; continue; }

    const key = rawMeta[i].slice(0, separatorIndex).trim();
    let value = rawMeta[i].slice(separatorIndex + 1).trim();

    // Handle YAML block scalar (> or |)
    if (value === '>' || value === '|') {
      const blockLines = [];
      i++;
      while (i < rawMeta.length && (rawMeta[i].startsWith('  ') || rawMeta[i].trim() === '')) {
        blockLines.push(rawMeta[i].trim());
        i++;
      }
      meta[key] = blockLines.filter(Boolean).join(' ');
      continue;
    }

    value = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    meta[key] = value;
    i++;
  }

  const body = fileContent.slice(match[0].length).trim();
  return { meta, body };
}

// ── Markdown → HTML renderer ─────────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInline(text) {
  return text
    // Links: [text](url)  — process before bold/italic so brackets don't interfere
    .replace(/\[([^\]]*)\]\(([^)]+)\)/g, (_, t, url) =>
      `<a href="${escapeHtml(url.trim())}" rel="noopener noreferrer">${escapeHtml(t.trim())}</a>`
    )
    // Bold: **text**
    .replace(/\*\*(.+?)\*\*/g, (_, t) => `<strong>${escapeHtml(t)}</strong>`)
    // Italic: *text* (not preceded/followed by another *)
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, (_, t) => `<em>${escapeHtml(t)}</em>`)
    // Hard line break: backslash at end of line (Decap CMS style)
    .replace(/\\\s*$/gm, '<br>')
    // Escape remaining plain text segments
    .replace(/(?<!<[^>]*)(?<!href=")(?<!src=")([&<>"'])/g, (m) => {
      // already escaped above in escapeHtml calls; just pass through
      return m;
    });
}

function renderMarkdown(md) {
  // Normalise line endings
  const text = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split into blocks (double newline)
  const blocks = text.split(/\n{2,}/);
  const html = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Heading
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      html.push(`<h${level}>${escapeHtml(headingMatch[2].trim())}</h${level}>`);
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      const inner = trimmed.replace(/^> ?/gm, '').trim();
      html.push(`<blockquote>${renderInline(inner)}</blockquote>`);
      continue;
    }

    // Paragraph — join single newlines with a space or <br> depending on trailing backslash
    const lines = trimmed.split('\n');
    const paragraphContent = lines
      .map((line, idx) => {
        const hardBreak = line.match(/\\\s*$/);
        const cleanLine = line.replace(/\\\s*$/, '').trimEnd();
        if (hardBreak && idx < lines.length - 1) {
          return renderInline(cleanLine) + '<br>';
        }
        return renderInline(cleanLine);
      })
      .join('\n');

    html.push(`<p>${paragraphContent}</p>`);
  }

  return html.join('\n');
}

// ── Post HTML template ───────────────────────────────────────────────────────

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('nl-BE', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(date);
}

function buildPostHtml(post, bodyHtml) {
  const imageHtml = post.image
    ? `<div class="post-hero__image"><img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}"></div>`
    : '';

  return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(post.title)} — De Tussenruimte</title>
    <meta name="description" content="${escapeHtml(post.excerpt)}">
    <link rel="canonical" href="/blog/posts/${escapeHtml(post.slug)}/">
    <link rel="stylesheet" href="../../../assets/css/main.css">
</head>
<body>

    <!-- ── Navigatie ──────────────────────────────────────────────────────── -->
    <nav class="site-nav site-nav--solid" aria-label="Hoofdnavigatie">
        <a href="../../../" class="site-nav__logo">De Tussenruimte</a>
        <ul class="site-nav__links" role="list">
            <li><a href="../../../#over"           class="site-nav__link">Over</a></li>
            <li><a href="../../../#diensten"       class="site-nav__link">Aanbod</a></li>
            <li><a href="../../../loopbaancheque/" class="site-nav__link">Loopbaancheque</a></li>
            <li><a href="../../../retraite/"       class="site-nav__link">Retraite</a></li>
            <li><a href="../../../blog/"           class="site-nav__link">Blog</a></li>
            <li><a href="../../../#contact"        class="site-nav__link site-nav__link--cta">Contact</a></li>
        </ul>
        <button class="site-nav__toggle" aria-label="Menu openen" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
    </nav>

    <div class="site-nav__mobile-menu" role="dialog" aria-label="Mobiel menu">
        <a href="../../../"                class="site-nav__mobile-link">Home</a>
        <a href="../../../#diensten"       class="site-nav__mobile-link">Aanbod</a>
        <a href="../../../loopbaancheque/" class="site-nav__mobile-link">Loopbaancheque</a>
        <a href="../../../retraite/"       class="site-nav__mobile-link">Retraite</a>
        <a href="../../../blog/"           class="site-nav__mobile-link">Blog</a>
        <a href="../../../#contact"        class="site-nav__mobile-link">Contact</a>
    </div>

    <!-- ── Post header ────────────────────────────────────────────────────── -->
    <main id="post-main">
        <header class="post-hero">
            <p class="post-hero__label">${escapeHtml(post.category)}</p>
            <h1 class="post-hero__title">${escapeHtml(post.title)}</h1>
            ${post.excerpt ? `<p class="post-hero__excerpt">${escapeHtml(post.excerpt)}</p>` : ''}
            <div class="post-hero__meta">
                <span>${escapeHtml(formatDate(post.date))}</span>
            </div>
        </header>

        ${imageHtml}

        <article class="post-body">
            <a href="/blog/" class="post-back">Terug naar blog</a>
            ${bodyHtml}
        </article>
    </main>

    <!-- ── Footer ─────────────────────────────────────────────────────────── -->
    <footer class="site-footer">
        <span class="footer__brand">De Tussenruimte — Blog</span>
        <nav class="footer__links" aria-label="Footernavigatie">
            <a href="../../../"                class="footer__link">Home</a>
            <a href="../../../loopbaancheque/" class="footer__link">Loopbaancheque</a>
            <a href="../../../retraite/"       class="footer__link">Retraite</a>
            <a href="../../../#contact"        class="footer__link">Contact</a>
        </nav>
        <small class="footer__credit">Site gemaakt door <a href="https://johanbeysen.online" rel="noopener noreferrer">Johan Beysen</a></small>
    </footer>

    <script src="../../../assets/js/nav.js"></script>
</body>
</html>
`;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractExcerpt(meta, body) {
  if (meta.excerpt) return meta.excerpt;

  const firstParagraph = body
    .split(/\n\n+/)
    .map((part) => part.replace(/[#*_`>\-\\]/g, '').trim())
    .find(Boolean);

  if (!firstParagraph) return '';
  return firstParagraph.length > 240
    ? firstParagraph.slice(0, 237).trim() + '...'
    : firstParagraph;
}

function toIsoDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

// ── Main ─────────────────────────────────────────────────────────────────────

function loadAndBuildPosts() {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs
    .readdirSync(postsDir)
    .filter((file) => file.toLowerCase().endsWith('.md'));

  const posts = files.map((fileName) => {
    const slug = fileName.replace(/\.md$/i, '');
    const fullPath = path.join(postsDir, fileName);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { meta, body } = parseFrontmatter(raw);

    const post = {
      slug,
      title: meta.title || slug,
      date: toIsoDate(meta.date),
      category: meta.category || 'Blog',
      excerpt: extractExcerpt(meta, body),
      image: meta.image || '',
    };

    // Generate static post HTML
    const bodyHtml = renderMarkdown(body);
    const postHtml = buildPostHtml(post, bodyHtml);
    const postDir = path.join(postsDir, slug);
    fs.mkdirSync(postDir, { recursive: true });
    fs.writeFileSync(path.join(postDir, 'index.html'), postHtml, 'utf8');

    return post;
  });

  return posts.sort((a, b) => {
    const timeA = a.date ? new Date(a.date).getTime() : 0;
    const timeB = b.date ? new Date(b.date).getTime() : 0;
    return timeB - timeA;
  });
}

function writePostsJson(posts) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2) + '\n', 'utf8');
}

const posts = loadAndBuildPosts();
writePostsJson(posts);
console.log(`Generated ${posts.length} blog posts → static HTML + JSON index`);
