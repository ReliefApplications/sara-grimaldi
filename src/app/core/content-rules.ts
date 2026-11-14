/**
 * Rules of the /content files that are plain data: lists of allowed values,
 * key names and required fields. This file is the single source for them. It
 * is read both by the app (the types in content.models.ts are built from
 * these lists) and by tools/build-content.mjs, which checks the content, so
 * it must stay free of imports and of anything but constants.
 */

export const LANGS = ['fr', 'en'] as const;
export const DEFAULT_LANG = 'fr';

/** Film families, in the order they are always shown. */
export const FAMILIES = ['fiction', 'documentaire', 'impact'] as const;

export const WATCH_MODES = ['full', 'trailer', 'external', 'none'] as const;

/** What an organisation is to Sara: someone she worked for, or a medium that covered her work. */
export const ORGANISATION_KINDS = ['client', 'press'] as const;

/** Widths (px) every still is exported in, unless the image sets its own `widths`. */
export const IMAGE_WIDTHS = [480, 768, 1152];

/** How an image fills its tile (design system, 7.1). */
export const IMAGE_FITS = ['cover', 'poster'] as const;

/** Pages listed in the navigation, in display order. */
export const NAV_PAGE_IDS = ['films', 'visual-stories', 'press', 'about', 'contact'] as const;

/** Keys of `ui` in site.json. */
export const UI_KEYS = [
  'skipToContent',
  'home',
  'mainNavLabel',
  'languageNavLabel',
  'menu',
  'close',
  'newWindow',
  'email',
  'filmCountOne',
  'filmCountOther',
  'watchFull',
  'watchTrailer',
  'onRequest',
  'currentLanguage',
  'lastUpdated',
  'dateMissing',
  'noscript',
  'bandPause',
  'bandResume',
  'familiesNavLabel',
] as const;

/** Rows of the data table of a film, in display order. */
export const FILM_DATA_KEYS = [
  'genre',
  'country',
  'languages',
  'format',
  'production',
  'support',
  'broadcast',
] as const;

/** Keys of `labels` in pages/films.json. */
export const FILM_LABEL_KEYS = [
  'back',
  'synopsis',
  'statement',
  'stills',
  'selections',
  'moreSelections',
  'credits',
  'press',
  'previous',
  'next',
  'near',
  'year',
  'duration',
  ...FILM_DATA_KEYS,
] as const;

/** The legal notice and the privacy policy share one layout and one file shape. */
export const LEGAL_PAGE_IDS = ['legal', 'privacy'] as const;

/**
 * A fact that is not known yet is written as a bracketed marker, e.g.
 * "[à compléter : adresse]" or "[to be completed: address]". It is shown
 * highlighted, and the build warns while any remains (design system, 3.2).
 */
export const PLACEHOLDER_PATTERN = /\[(?:à compléter|to be completed)[^\]]*\]/;

const legalProse = [
  'intro',
  'sections[].paragraphs',
  'sections[].list',
  'sections[].after',
  'sections[].links[].label',
];

/**
 * Fields shown as running text, where `*Title*` marks a film or work title.
 * An asterisk anywhere else would be printed as is, so the build refuses it.
 */
export const PROSE_FIELDS: Record<string, string[]> = {
  'pages/about': ['biography', 'career[].text', 'career[].detail'],
  'pages/visual-stories': ['work[].challenge', 'work[].done', 'work[].result', 'team'],
  'pages/legal': legalProse,
  'pages/privacy': legalProse,
  films: ['synopsis', 'statement'],
  press: ['description'],
  organisations: ['role'],
  'in-development': ['description'],
};

const seo = ['seo.title', 'seo.description'];
const legalPage = [...seo, 'heading', 'sections[].id', 'sections[].heading', 'crossLink'];

/**
 * Fields that must be present and not empty, per file. "a.b" is a nested
 * field, "a[].b" a field of every item of the list "a". When a required
 * field is added to an interface of content.models.ts, add it here too.
 */
export const REQUIRED = {
  site: [
    'name',
    'roles',
    'languages[].code',
    'languages[].short',
    'languages[].name',
    ...NAV_PAGE_IDS.map((page) => `nav.${page}`),
    ...FAMILIES.map((family) => `families.${family}`),
    ...UI_KEYS.map((key) => `ui.${key}`),
    'contact.email',
    'social[].label',
    'social[].url',
    'footer.label',
    'footer.invitation',
    'footer.legalNavLabel',
    ...LEGAL_PAGE_IDS.map((page) => `footer.legalLinks.${page}`),
    'privacyNotice.enabled',
    'privacyNotice.version',
    'privacyNotice.text',
    'privacyNotice.linkLabel',
    'privacyNotice.dismissLabel',
    'privacyNotice.regionLabel',
    'seo.description',
  ],
  pages: {
    home: [
      ...seo,
      'statement',
      'intro',
      'aboutLink',
      'featured.label',
      'featured.films',
      'featured.allLink',
      'collaborations.label',
      'collaborations.context',
      'press.allLink',
    ],
    films: [
      ...seo,
      'heading',
      'intro',
      'familyNavLabel',
      ...FILM_LABEL_KEYS.map((key) => `labels.${key}`),
    ],
    press: [...seo, 'heading', 'intro'],
    about: [
      ...seo,
      'heading',
      'opening',
      'biography',
      'careerHeading',
      'career[].period',
      'career[].text',
      'collaborationsHeading',
      'inDevelopmentHeading',
      'filmsLink',
      'contactLink',
    ],
    'visual-stories': [
      ...seo,
      'heading',
      'positioning',
      'hero',
      'workWithUs',
      'offersHeading',
      'offers[].title',
      'offers[].text',
      'offers[].image',
      'workHeading',
      'workLabels.challenge',
      'workLabels.done',
      'workLabels.result',
      'workLabels.film',
      'work[].category',
      'work[].title',
      'work[].credits',
      'work[].challenge',
      'work[].done',
      'work[].result',
      'trustedHeading',
      'trusted',
      'teamHeading',
      'contactHeading',
      'contactName',
      'contactButton',
      'contactLine',
    ],
    contact: [
      ...seo,
      'heading',
      'intro',
      'location',
      'labels.phone',
      'labels.location',
      'labels.social',
    ],
    'not-found': [...seo, 'code', 'heading', 'homeLink'],
    legal: legalPage,
    privacy: legalPage,
  },
  films: [
    'title',
    'titleLang',
    'family',
    'year',
    'roles',
    'logline',
    'watch.mode',
    'published',
    'credits[].title',
    'credits[].items[].name',
    'selections[].festival',
  ],
  press: ['publication', 'year', 'description', 'country', 'articleLang'],
  'in-development': ['title', 'titleLang', 'format', 'order', 'home'],
  organisations: ['name', 'kind', 'order', 'home'],
};
