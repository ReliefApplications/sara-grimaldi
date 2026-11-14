// Runs automatically after `npm run build`.
//
// 1. GitHub Pages serves 404.html for any URL that is not a real file. The
//    build writes the application shell (without prerendered content) to
//    index.csr.html; publishing it as 404.html lets the Angular router take
//    over for unknown addresses and show the not-found page in the right
//    language. That shell is the only document that shows nothing without
//    JavaScript, so it gets a <noscript> message built from the content
//    (name, sentence in both languages, link to the home page, contact email).
// 2. The root index.html only redirects to the default language. Pages are
//    folders, so the redirect target gets its trailing slash to avoid a
//    second redirect by the server.
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const dist = join(root, 'dist', 'sara-grimaldi', 'browser');
const site = JSON.parse(readFileSync(join(root, '.generated', 'content', 'site.json'), 'utf8'));

const escape = (text) =>
  String(text).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
  );
// Inline styles: the stylesheet may not apply to this fallback (design system, 8.26).
const noscript = `<noscript>
      <div style="background:#F6F1E8;color:#1C1A17;font-family:Georgia,'Times New Roman',serif;padding:20px">
        <p><strong>${escape(site.name)}</strong></p>
        <p lang="fr">${escape(site.ui.noscript.fr)}</p>
        <p lang="en">${escape(site.ui.noscript.en)}</p>
        <p><a style="color:inherit" href="./">${escape(site.ui.home.fr)} / ${escape(site.ui.home.en)}</a></p>
        <p><a style="color:inherit" href="mailto:${escape(site.contact.email)}">${escape(site.contact.email)}</a></p>
      </div>
    </noscript>`;

const shell = readFileSync(join(dist, 'index.csr.html'), 'utf8');
if (!shell.includes('<app-root>')) {
  throw new Error('spa-fallback: <app-root> not found in index.csr.html');
}
writeFileSync(join(dist, '404.html'), shell.replace('<app-root>', `${noscript}\n    <app-root>`));
rmSync(join(dist, 'index.csr.html'));
console.log('spa-fallback: 404.html created');

const index = join(dist, 'index.html');
const html = readFileSync(index, 'utf8');
if (html.includes('http-equiv="refresh"')) {
  writeFileSync(index, html.replace(/(\/(?:fr|en))(?=")/g, '$1/'));
  console.log('spa-fallback: root redirect points to a folder address');
}
