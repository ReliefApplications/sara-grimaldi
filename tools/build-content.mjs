// Prepares everything the app loads from /content and writes it to
// .generated/content, the only content folder that is published. Runs before `npm start`, `npm run build` and `npm test`.
//
// - Checks every file: valid JSON, required fields present, French text never
//   empty, images described and present in every exported width.
// - Leaves out what must not be public: films with "published": false, any
//   block or list item with "show": false (e.g. the second contact), list items with
//   "published": false (e.g. a section of a legal page), "_note" keys,
//   and the images that only those refer to.
// - Bundles each collection (one file per entry) into one JSON array, because
//   a static site cannot list a folder. The file name becomes the "slug".
// - Writes build.json: public address of the site (SITE_URL) and whether
//   search engines must stay away (SITE_NOINDEX).
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join } from 'node:path';
// The rules are shared with the app: one list, read by both.
import {
  FAMILIES,
  IMAGE_FITS,
  IMAGE_WIDTHS,
  ORGANISATION_KINDS,
  PLACEHOLDER_PATTERN,
  PROSE_FIELDS,
  REQUIRED,
  WATCH_MODES,
} from '../src/app/core/content-rules.ts';

const root = join(import.meta.dirname, '..');
const contentDir = join(root, 'content');
const outDir = join(root, '.generated', 'content');

// Most recent year first; within the same year, a lower "order" comes first.
const byYearThenOrder = (a, b) =>
  (b.year ?? 0) - (a.year ?? 0) ||
  (a.order ?? Infinity) - (b.order ?? Infinity) ||
  a.slug.localeCompare(b.slug);

// A lower "order" comes first.
const byOrder = (a, b) =>
  (a.order ?? Infinity) - (b.order ?? Infinity) || a.slug.localeCompare(b.slug);

const COLLECTIONS = [
  { name: 'films', sort: byYearThenOrder, keep: (entry) => entry.published === true },
  { name: 'press', sort: byYearThenOrder },
  { name: 'in-development', sort: byOrder },
  { name: 'organisations', sort: byOrder },
];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isBlank = (value) => typeof value === 'string' && value.trim() === '';
const isEmpty = (value) =>
  value == null ||
  isBlank(value) ||
  (Array.isArray(value) && (value.length === 0 || value.every(isBlank)));
/** Switched off in content: `"show": false` or, for an item of a list, `"published": false`. */
const isHidden = (value) => isObject(value) && (value.show === false || value.published === false);
/** `{ "fr": ..., "en": ... }` */
const isLocalized = (value) =>
  isObject(value) &&
  Object.keys(value).length > 0 &&
  Object.keys(value).every((key) => key === 'fr' || key === 'en');

/** Values found at a path such as "credits[].items[].name" (undefined where missing). */
function valuesAt(value, path) {
  const [head, ...rest] = path;
  if (head === undefined) return [value];
  const list = head.endsWith('[]');
  const child = isObject(value) ? value[list ? head.slice(0, -2) : head] : undefined;
  if (list) {
    // A missing list is fine here; list "a" itself is required by listing "a".
    return Array.isArray(child) ? child.flatMap((item) => valuesAt(item, rest)) : [];
  }
  return valuesAt(child, rest);
}

/**
 * Removes "_note"-style keys and anything switched off with "show": false,
 * whether it is a block or an item of a list.
 */
export function publicCopy(value) {
  if (Array.isArray(value)) return value.filter((item) => !isHidden(item)).map(publicCopy);
  if (!isObject(value)) return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, child]) => !key.startsWith('_') && !isHidden(child))
      .map(([key, child]) => [key, publicCopy(child)]),
  );
}

/** Files of an image reference: every exported width of a still, or the one file. */
export function imageFiles(image) {
  return typeof image.width === 'number'
    ? (image.widths ?? IMAGE_WIDTHS).map((width) => image.src.replace(/(\.\w+)$/, `-${width}$1`))
    : [image.src];
}

/** Every image reference (an object with a "src") inside a value. */
export function imagesIn(value) {
  if (Array.isArray(value)) return value.flatMap(imagesIn);
  if (!isObject(value)) return [];
  return [
    ...(typeof value.src === 'string' ? [value] : []),
    ...Object.values(value).flatMap(imagesIn),
  ];
}

/**
 * Checks the content and writes .generated/content.
 * Returns the list of problems found (empty when everything is fine).
 */
export function buildContent({ production = false } = {}) {
  const problems = [];
  const problem = (message) => problems.push(message);

  const read = (file) => {
    try {
      return JSON.parse(readFileSync(join(contentDir, file), 'utf8'));
    } catch (error) {
      problem(`content/${file} cannot be read as JSON: ${error.message}`);
      return undefined;
    }
  };

  const check = (value, file, required, prose = []) => {
    for (const path of required) {
      for (const found of valuesAt(value, path.split('.'))) {
        if (isEmpty(found) || (isLocalized(found) && isEmpty(found.fr))) {
          problem(`content/${file}: "${path}" is missing or empty`);
        }
      }
    }
    checkTexts(value, file, '', prose);
  };

  // `*Title*` is only understood in running text, and only in pairs.
  const checkAsterisks = (text, file, path, prose) => {
    if (typeof text !== 'string' || !text.includes('*')) return;
    if (!prose.includes(path.replace(/\[\d+\]/g, '[]'))) {
      problem(`content/${file}: "${path}" contains an asterisk, which would be shown as is`);
    } else if (text.replace(/\*[^*]+\*/g, '').includes('*')) {
      problem(
        `content/${file}: "${path}" has an asterisk without its pair: "${text.slice(0, 50)}"`,
      );
    }
  };

  // Wherever a text exists it needs its French version; images need more.
  const checkTexts = (value, file, path, prose) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => checkTexts(item, file, `${path}[${index}]`, prose));
    } else if (isLocalized(value)) {
      if (isEmpty(value.fr)) problem(`content/${file}: "${path}" has no French text`);
      for (const text of Object.values(value).flat()) checkAsterisks(text, file, path, prose);
    } else if (isObject(value)) {
      if (typeof value.src === 'string') checkImage(value, file, path);
      for (const [key, child] of Object.entries(value)) {
        if (key.startsWith('_')) continue;
        checkTexts(child, file, path ? `${path}.${key}` : key, prose);
      }
    } else {
      checkAsterisks(value, file, path, prose);
    }
  };

  const checkImage = (image, file, path) => {
    if (!(image.alt?.fr && image.alt?.en)) {
      problem(`content/${file}: image "${path}" needs an "alt" text in French and English`);
    }
    // A still (it has a width) is exported in several widths; see README.
    const files = imageFiles(image);
    if (image.fit !== undefined && !IMAGE_FITS.includes(image.fit)) {
      problem(
        `content/${file}: image "${path}" has "fit" "${image.fit}"; use ${IMAGE_FITS.join(' or ')}`,
      );
    }
    if (typeof image.width === 'number' && typeof image.height !== 'number') {
      problem(`content/${file}: image "${path}" needs "width" and "height"`);
    }
    for (const name of files) {
      if (!existsSync(join(contentDir, name))) {
        problem(`content/${file}: image file content/${name} does not exist`);
      }
    }
  };

  const write = (file, value) => {
    mkdirSync(join(outDir, file, '..'), { recursive: true });
    writeFileSync(join(outDir, file), JSON.stringify(publicCopy(value)));
  };

  // Start clean so nothing from an earlier build is published by accident.
  rmSync(outDir, { recursive: true, force: true });

  const site = read('site.json');
  if (site) {
    check(site, 'site.json', REQUIRED.site);
    write('site.json', site);
  }

  const pages = {};
  for (const [id, required] of Object.entries(REQUIRED.pages)) {
    const page = read(`pages/${id}.json`);
    if (page) {
      check(page, `pages/${id}.json`, required, PROSE_FIELDS[`pages/${id}`]);
      write(`pages/${id}.json`, page);
      pages[id] = page;
    }
  }

  const collections = {};
  for (const { name, sort, keep = () => true } of COLLECTIONS) {
    const entries = [];
    for (const file of readdirSync(join(contentDir, name)).filter((f) => f.endsWith('.json'))) {
      const entry = read(`${name}/${file}`);
      if (entry) {
        check(entry, `${name}/${file}`, REQUIRED[name], PROSE_FIELDS[name]);
        entries.push({ slug: basename(file, '.json'), ...entry });
      }
    }
    collections[name] = entries.filter(keep).sort(sort);
    write(`collections/${name}.json`, collections[name]);
    console.log(`content: ${name} (${collections[name].length} of ${entries.length} entries)`);
  }

  // Rules that span several files.
  const published = new Set(collections.films.map((film) => film.slug));
  for (const film of collections.films) {
    const file = `films/${film.slug}.json`;
    if (!FAMILIES.includes(film.family)) {
      problem(`content/${file}: "family" must be one of ${FAMILIES.join(', ')}`);
    }
    if (!WATCH_MODES.includes(film.watch?.mode)) {
      problem(`content/${file}: "watch.mode" must be one of ${WATCH_MODES.join(', ')}`);
    }
  }
  for (const organisation of collections.organisations) {
    if (!ORGANISATION_KINDS.includes(organisation.kind)) {
      problem(
        `content/organisations/${organisation.slug}.json: "kind" must be one of ` +
          ORGANISATION_KINDS.join(', '),
      );
    }
  }
  for (const slug of pages.home?.featured?.films ?? []) {
    if (!published.has(slug)) {
      problem(`content/pages/home.json: featured film "${slug}" is not a published film`);
    }
  }
  for (const item of collections.press) {
    if (!site?.articleLanguages?.[item.articleLang]) {
      problem(
        `content/press/${item.slug}.json: "articleLang" "${item.articleLang}" has no entry in ` +
          '"articleLanguages" of content/site.json',
      );
    }
    if (item.relatedFilm && !existsSync(join(contentDir, 'films', `${item.relatedFilm}.json`))) {
      problem(
        `content/press/${item.slug}.json: "relatedFilm" "${item.relatedFilm}" does not exist`,
      );
    }
  }

  // Facts still to be supplied: shown highlighted on the site, and listed here.
  const pending = JSON.stringify(publicCopy([site, pages, collections])).match(
    new RegExp(PLACEHOLDER_PATTERN.source, 'g'),
  );
  if (pending) {
    console.warn(
      `content: WARNING, ${pending.length} placeholder(s) "[à compléter …]" / "[to be completed …]" ` +
        'are still shown on the site (legal pages). Complete them before launch.',
    );
  }

  // Only the images that published content refers to are copied; an image
  // of an unpublished film or of a hidden block stays out of the site.
  for (const image of imagesIn(publicCopy([site, pages, collections]))) {
    for (const name of imageFiles(image)) {
      if (existsSync(join(contentDir, name))) {
        mkdirSync(dirname(join(outDir, name)), { recursive: true });
        copyFileSync(join(contentDir, name), join(outDir, name));
      }
    }
  }

  // Public address of the site, always ending with "/". The deployment
  // workflow sets SITE_URL from the GitHub Pages settings.
  const siteUrl = process.env.SITE_URL;
  if (production && !siteUrl) {
    problem(
      'SITE_URL is not set. A production build needs the public address of the site for ' +
        'canonical and sharing links, e.g. SITE_URL=http://localhost:4300 npm run build',
    );
  }
  const build = {
    siteUrl: (siteUrl || 'http://localhost:4200').replace(/\/*$/, '/'),
    noindex: process.env.SITE_NOINDEX === 'true',
  };
  writeFileSync(join(outDir, 'build.json'), JSON.stringify(build));
  console.log(`content: site URL ${build.siteUrl}${build.noindex ? ' (noindex)' : ''}`);

  return problems;
}

// Run directly: `node tools/build-content.mjs [--production]`.
if (process.argv[1] === import.meta.filename) {
  const problems = buildContent({ production: process.argv.includes('--production') });
  problems.forEach((message) => console.error(`content problem: ${message}`));
  if (problems.length) process.exit(1);
}
