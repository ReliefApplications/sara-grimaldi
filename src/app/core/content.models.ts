/**
 * Types describing the JSON files in /content. Lists of allowed values and of
 * key names come from content-rules.ts, which the content check reads too.
 */
import {
  FAMILIES,
  FILM_DATA_KEYS,
  FILM_LABEL_KEYS,
  LANGS,
  LEGAL_PAGE_IDS,
  NAV_PAGE_IDS,
  UI_KEYS,
  WATCH_MODES,
} from './content-rules';

export { DEFAULT_LANG, FAMILIES, FILM_DATA_KEYS, IMAGE_WIDTHS, LANGS } from './content-rules';

export type Lang = (typeof LANGS)[number];
export type Family = (typeof FAMILIES)[number];

/** A value written once per language: `{ "fr": ..., "en": ... }`. */
export type Localized<T> = Record<Lang, T>;

/** The same content with every `Localized<T>` replaced by the value for one language. */
export type Resolved<T> =
  T extends Localized<infer U>
    ? U
    : T extends readonly (infer I)[]
      ? Resolved<I>[]
      : T extends object
        ? { [K in keyof T]: Resolved<T[K]> }
        : T;

export type Text = Localized<string>;
export type Paragraphs = Localized<string[]>;

export interface Seo {
  title: Text;
  description: Text;
}

/**
 * A still, portrait or poster, exported by hand in several widths.
 * `src` is relative to /content and names the set: "images/immunity.webp"
 * stands for images/immunity-480.webp, images/immunity-768.webp, and so on.
 */
export interface ImageRef {
  src: string;
  /** Pixel size of the largest file; gives the browser the proportions. */
  width: number;
  height: number;
  alt: Text;
  /** Only when the set differs from IMAGE_WIDTHS, e.g. [480, 768, 960] for a portrait. */
  widths?: number[];
}

/** One file used as is, e.g. the 1200 × 630 sharing image "images/share.jpg". */
export interface ImageFile {
  src: string;
  alt: Text;
}

/** .generated/content/build.json, written by tools/build-content.mjs. */
export interface BuildInfo {
  /** Public address of the site, ending with "/". */
  siteUrl: string;
  /** True until launch: every page asks search engines not to index it. */
  noindex: boolean;
}

/** content/site.json */
export interface SiteContent {
  name: string;
  roles: Localized<string[]>;
  /** `name` is read to screen-reader users after the short label, e.g. "English version". */
  languages: { code: Lang; short: string; name: string }[];
  /** How to say "article in <language>" for each language a press article can be in. */
  articleLanguages: Record<string, Text>;
  nav: Record<NavPageId, Text>;
  families: Record<Family, Text>;
  ui: Record<(typeof UI_KEYS)[number], Text>;
  /** The phone is shown on the Contact page only, and only when both values are set. */
  contact: { email: string; phone?: string; phoneDisplay?: string };
  location: Text;
  social: { label: string; url: string }[];
  /** Optional second contact on the Contact page; absent while `"show"` is false. */
  secondaryContact?: { show: boolean; heading: Text; name: string; email: string };
  footer: {
    label: Text;
    invitation: Text;
    legalNavLabel: Text;
    legalLinks: Record<LegalPageId, Text>;
  };
  /** The small notice at the bottom of the window (design system, 8.26). */
  privacyNotice: {
    /** The one switch: false removes the notice entirely. */
    enabled: boolean;
    /** Change it when the text changes: everyone then sees the notice again. */
    version: string;
    text: Text;
    linkLabel: Text;
    dismissLabel: Text;
    regionLabel: Text;
  };
  seo: { description: Text; image?: ImageFile };
}

/** content/pages/*.json */
export interface HomePage {
  seo: Seo;
  statement: Text;
  /** Part of the statement to set in italic; leave empty for none. */
  statementEmphasis: Text;
  intro: Text;
  /** `films`: file names of the featured films, in display order (the first three are shown). */
  featured: { label: Text; films: string[]; filmLink: Text; allLink: Text };
  collaborations: { label: Text; context: Text; aboutLink: Text };
  press: { label: Text; count: number; allLink: Text };
  inDevelopment: { label: Text };
}

export interface FilmsPage {
  seo: Seo;
  heading: Text;
  intro: Text;
  familyNavLabel: Text;
  labels: Record<(typeof FILM_LABEL_KEYS)[number], Text>;
}

export interface PressPage {
  seo: Seo;
  heading: Text;
  intro: Text;
}

export interface AboutPage {
  seo: Seo;
  heading: Text;
  opening: Text;
  biography: Paragraphs;
  portrait?: ImageRef;
  careerHeading: Text;
  career: { period: Text; text: Text }[];
  collaborationsHeading: Text;
  inDevelopmentHeading: Text;
  filmsLink: Text;
  contactLink: Text;
}

export interface ContactPage {
  seo: Seo;
  heading: Text;
  intro: Text;
  labels: Record<'location' | 'social', Text>;
}

export interface NotFoundPage {
  seo: Seo;
  code: string;
  heading: Text;
  homeLink: Text;
}

/** content/pages/legal.json and content/pages/privacy.json */
export interface LegalPage {
  seo: Seo;
  heading: Text;
  /** Date of the last update, "YYYY-MM-DD"; empty shows a "to be completed" marker. */
  updated: string;
  intro?: Text;
  sections: LegalSection[];
  /** Label of the link to the other legal page. */
  crossLink: Text;
}

export interface LegalSection {
  /** Anchor of the section, the same in both languages. */
  id: string;
  heading: Text;
  paragraphs?: Paragraphs;
  list?: Paragraphs;
  /** Paragraphs that follow the list. */
  after?: Paragraphs;
  /** A link without `url` is shown as plain text (e.g. a placeholder). */
  links?: { label: Text; url?: string }[];
  /** `false` keeps the section in content but off the site. */
  published?: boolean;
}

export interface Pages {
  home: HomePage;
  films: FilmsPage;
  press: PressPage;
  about: AboutPage;
  contact: ContactPage;
  'not-found': NotFoundPage;
  legal: LegalPage;
  privacy: LegalPage;
}
export type PageId = keyof Pages;
/** Pages that have their own address. */
export type RoutedPageId = Exclude<PageId, 'not-found'>;
/** Pages listed in the navigation. */
export type NavPageId = (typeof NAV_PAGE_IDS)[number];
export type LegalPageId = (typeof LEGAL_PAGE_IDS)[number];

export type FilmDataKey = (typeof FILM_DATA_KEYS)[number];
export type WatchMode = (typeof WATCH_MODES)[number];

/** content/films/<slug>.json — `slug` is the file name, added at build time. */
export interface Film {
  slug: string;
  title: string;
  /** Language of the title, e.g. "it", so screen readers pronounce it right. */
  titleLang: string;
  family: Family;
  year: number;
  duration?: string;
  roles: Localized<string[]>;
  logline: Text;
  synopsis?: Paragraphs;
  statement?: Paragraphs;
  /** At most 180 characters, with the quotation marks of each language. */
  statementQuote?: Text;
  proof?: Text;
  data?: Partial<Record<FilmDataKey, Text>>;
  credits?: { title: Text; items: { role?: Text; name: string }[] }[];
  selections?: { festival: string; place?: Text; award?: Text }[];
  selectionsSummary?: Text;
  watch: {
    mode: WatchMode;
    provider?: 'vimeo' | 'youtube';
    id?: string;
    externalLabel?: Text;
    externalUrl?: string;
  };
  still?: ImageRef;
  stills?: ImageRef[];
  poster?: ImageRef;
  /** The lead still cropped to 1200 × 630 for sharing; the site default is used without it. */
  shareImage?: ImageFile;
  /** Unpublished films stay in /content but are left out of the site. */
  published: boolean;
  /** Position among films of the same year (lower first). */
  order?: number;
}

/** content/press/<slug>.json */
export interface PressItem {
  slug: string;
  publication: string;
  /** Film titles are written `*Title*`. */
  description: Text;
  year: number;
  /** Position among items of the same year (lower first). */
  order?: number;
  country: Text;
  /** Language code of the article ("fr", "it"…), a key of `articleLanguages` in site.json. */
  articleLang: string;
  url?: string;
  /** Scan of the article, one file, linked from the row when there is no `url`. */
  scan?: ImageFile;
  /** Slug of an entry in content/films. */
  relatedFilm?: string;
}

/** content/collaborations/<slug>.json */
export interface Collaboration {
  slug: string;
  names: string[];
  role: Text;
  order: number;
  home: boolean;
}

/** content/in-development/<slug>.json */
export interface InDevelopmentItem {
  slug: string;
  title: string;
  titleLang: string;
  /** Format and status, e.g. ["Long métrage", "scénario"]. */
  format: Localized<string[]>;
  description?: Text;
  order: number;
  home: boolean;
}
