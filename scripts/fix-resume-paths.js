#!/usr/bin/env node
/**
 * Post-processes resume static export HTML files to prepend /resume to all
 * local absolute asset paths (e.g. src="/hero.jpg" → src="/resume/hero.jpg")
 * that were not already prefixed by Next.js basePath.
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'resume');

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dirPath, e.name);
    if (e.isDirectory()) {
      walk(full);
    } else if (e.name.endsWith('.html')) {
      let html = fs.readFileSync(full, 'utf8');
      // Fix src="/X" → src="/resume/X" (skip already-prefixed, http, data:)
      html = html.replace(/src="(\/(?!resume\/)[^"]+)"/g, (_, p) => `src="/resume${p}"`);
      fs.writeFileSync(full, html, 'utf8');
      console.log('Patched:', full);
    }
  }
}

walk(dir);
console.log('Done.');
