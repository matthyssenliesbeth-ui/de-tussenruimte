#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const postsDir = path.join(rootDir, 'blog', 'posts');
const outputDir = path.join(rootDir, 'assets', 'data');
const outputFile = path.join(outputDir, 'blog-posts.json');

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

function extractExcerpt(meta, body) {
  if (meta.excerpt) return meta.excerpt;

  const firstParagraph = body
    .split(/\n\n+/)
    .map((part) => part.replace(/[#*_`>\-]/g, '').trim())
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

function loadPosts() {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs
    .readdirSync(postsDir)
    .filter((file) => file.toLowerCase().endsWith('.md'));

  const posts = files.map((fileName) => {
    const slug = fileName.replace(/\.md$/i, '');
    const fullPath = path.join(postsDir, fileName);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { meta, body } = parseFrontmatter(raw);

    return {
      slug,
      title: meta.title || slug,
      date: toIsoDate(meta.date),
      category: meta.category || 'Blog',
      excerpt: extractExcerpt(meta, body),
      image: meta.image || '',
    };
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

const posts = loadPosts();
writePostsJson(posts);
console.log(`Generated ${posts.length} blog posts in ${path.relative(rootDir, outputFile)}`);
