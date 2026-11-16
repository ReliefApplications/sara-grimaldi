// Safety check on the finished build (dist). Runs automatically after
// `npm run build`, locally and in the deployment workflow, and stops the
// build if:
// - anything that must stay private is found in a published file, in its
//   text (also when escaped for HTML or JSON) or in its name: any text or
//   file name of an unpublished film, the contents of a block or list item
//   with "show": false (e.g. the second contact's name and email), a list item with
//   "published": false, or a "_note";
// - the published content folder holds anything other than the expected
//   files, or an image no published content refers to;
// - a page lacks a title of its own (within its language), a description,
//   canonical and language links, contains the text "undefined", or (when
//   SITE_NOINDEX is on) is indexable;
// - the site address is http:// (allowed for localhost only): GitHub Pages
//   reports http:// for a custom domain until "Enforce HTTPS" is ticked.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { imageFiles, imagesIn } from './build-content.mjs';

const root = join(import.meta.dirname, '..');
const dist = join(root, 'dist', 'sara-grimaldi');
const browser = join(dist, 'browser');
const contentDir = join(root, 'content');

/** Private values shorter than this are too common to search for (e.g. "fr"). */
const MIN_LENGTH = 4;

const problems = [];
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
const posix = (path) => path.split(sep).join('/');
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isHidden = (value) => isObject(value) && (value.show === false || value.published === false);
const strings = (value) =>
  typeof value === 'string'
    ? [value]
    : Array.isArray(value)
      ? value.flatMap(strings)
      : isObject(value)
        ? Object.values(value).flatMap(strings)
        : [];

/** Undoes HTML and JSON escaping, so "Tom &amp; Co" and "Tom & Co" read "Tom & Co". */
function plain(text) {
  const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
  return text
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/\\(["\\/])/g, '$1')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&(amp|quot|apos|lt|gt|nbsp);/g, (_, name) => entities[name]);
}

// 1. What is private and what is public, read from the source content.
const secrets = new Map(); // value -> where it comes from
const publicTexts = new Set();
const sort = (value, file, hidden) => {
  if (typeof value === 'string') {
    if (hidden) secrets.set(value, hidden);
    else publicTexts.add(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) =>
      sort(item, file, hidden ?? (isHidden(item) ? `a hidden list item of ${file}` : undefined)),
    );
  } else if (isObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      const why =
        hidden ??
        (key.startsWith('_')
          ? `the "${key}" of ${file}`
          : isHidden(child)
            ? `the hidden "${key}" block of ${file}`
            : undefined);
      sort(child, file, why);
    }
  }
};
for (const path of walk(contentDir).filter((file) => file.endsWith('.json'))) {
  const file = posix(relative(root, path));
  const entry = JSON.parse(readFileSync(path, 'utf8'));
  const unpublished = file.startsWith('content/films/') && entry.published !== true;
  sort(entry, file, unpublished ? `the unpublished film ${file}` : undefined);
  if (unpublished) {
    secrets.set(file.split('/').pop().replace('.json', ''), `the unpublished film ${file}`);
    for (const image of imagesIn(entry)) {
      imageFiles(image).forEach((name) =>
        secrets.set(name.split('/').pop(), `an image of ${file}`),
      );
    }
  }
}
// A value that is also used in public content (a common word, a shared
// credit) is not a secret; neither is a very short one.
for (const value of [...secrets.keys()]) {
  if (publicTexts.has(value) || value.trim().length < MIN_LENGTH) secrets.delete(value);
}
secrets.set('_note', 'a "_note" key');

// 2. No private value in any published file: neither in its text nor its name.
const files = walk(dist);
const textFiles = files.filter((file) => /\.(html|js|json|css|txt|svg|xml|map)$/.test(file));
for (const path of files) {
  const name = posix(relative(dist, path));
  const text = textFiles.includes(path) ? readFileSync(path, 'utf8') : '';
  const haystack = `${name}\n${text}\n${plain(text)}`;
  for (const [secret, what] of secrets) {
    if (haystack.includes(secret) || haystack.includes(plain(secret))) {
      problems.push(`${name} contains ${what}: "${secret.slice(0, 60)}"`);
    }
  }
}

// 3. The published content folder holds exactly what is expected.
const published = join(browser, 'content');
const expected = new Set(['site.json', 'build.json']);
for (const file of readdirSync(join(contentDir, 'pages'))) expected.add(`pages/${file}`);
for (const entry of readdirSync(contentDir, { withFileTypes: true })) {
  if (entry.isDirectory() && !['pages', 'images'].includes(entry.name)) {
    expected.add(`collections/${entry.name}.json`);
  }
}
const found = existsSync(published)
  ? walk(published).map((p) => posix(relative(published, p)))
  : [];
// Images are expected only if the published content itself refers to them.
for (const file of found.filter((name) => name.endsWith('.json'))) {
  try {
    const data = JSON.parse(readFileSync(join(published, file), 'utf8'));
    imagesIn(data).forEach((image) => imageFiles(image).forEach((name) => expected.add(name)));
  } catch {
    problems.push(`content/${file} is not valid JSON`);
  }
}
for (const file of found) {
  if (!expected.has(file)) problems.push(`content/${file} is published but not expected`);
}
for (const file of expected) {
  if (!found.includes(file)) problems.push(`content/${file} is expected but not published`);
}

// 4. Every prerendered page is complete. (index.html at the root only
// redirects and 404.html is the empty application shell.)
const pages = walk(browser).filter(
  (file) => file.endsWith('index.html') && file !== join(browser, 'index.html'),
);
const noindex = process.env.SITE_NOINDEX === 'true';
const titles = new Map();
/** The site address when it is http:// on a real host, else undefined. */
const insecureOrigin = (address) => {
  const { protocol, hostname, origin } = new URL(address);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(hostname);
  return protocol === 'http:' && !local ? origin : undefined;
};
const insecure = new Set();
for (const path of pages) {
  const name = posix(relative(browser, path));
  const html = readFileSync(path, 'utf8');
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, '');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const need = (ok, what) => ok || problems.push(`${name} has no ${what}`);

  need(title, 'title');
  // Unique within a language: the design system gives some pages the same
  // title in French and English (film titles are not translated).
  const key = `${name.split('/')[0]}: ${title}`;
  if (title && titles.has(key)) {
    problems.push(`${name} has the same title as ${titles.get(key)}: "${title}"`);
  }
  titles.set(key, name);
  need(/<meta name="description" content="[^"]+"/.test(html), 'description');
  const canonical = html.match(/<link rel="canonical" href="(https?:\/\/[^"]+\/)"/)?.[1];
  need(canonical, 'canonical link');
  if (canonical) insecure.add(insecureOrigin(canonical));
  for (const lang of ['fr', 'en', 'x-default']) {
    need(html.includes(`hreflang="${lang}"`), `"${lang}" language link`);
  }
  if (visible.includes('undefined')) {
    problems.push(`${name} contains the text "undefined"`);
  }
  const robots = /<meta name="robots" content="noindex, nofollow"/.test(html);
  if (noindex !== robots) {
    problems.push(`${name} ${noindex ? 'is missing' : 'has'} the noindex tag`);
  }
}
insecure.delete(undefined);
for (const origin of insecure) {
  problems.push(
    `the site address is ${origin}: canonical and sharing links would be written with http://. ` +
      'Tick "Enforce HTTPS" in the GitHub repository (Settings → Pages), then re-run the ' +
      'deployment (or set SITE_URL to the https:// address)',
  );
}
if (pages.length === 0) {
  problems.push('no prerendered page found');
}

if (problems.length) {
  problems.forEach((message) => console.error(`check-dist: ${message}`));
  console.error(`check-dist: FAILED with ${problems.length} problem(s); do not publish this build`);
  process.exit(1);
}
console.log(
  `check-dist: ok (${files.length} files checked against ${secrets.size} private values, ` +
    `${found.length} content files as expected, ${pages.length} pages complete` +
    `${noindex ? ', all noindex' : ''})`,
);
