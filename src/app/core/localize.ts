import { DEFAULT_LANG, Lang, LANGS, Resolved } from './content.models';

function isLocalized(value: object): value is Record<Lang, unknown> {
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((key) => (LANGS as readonly string[]).includes(key));
}

function isEmpty(value: unknown): boolean {
  return value == null || value === '' || (Array.isArray(value) && value.length === 0);
}

/**
 * Replaces every `{ "fr": ..., "en": ... }` object in `content` with the value
 * for `lang`, falling back to the default language when a translation is missing.
 */
export function localize<T>(content: T, lang: Lang): Resolved<T> {
  return resolve(content, lang) as Resolved<T>;
}

function resolve(value: unknown, lang: Lang): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => resolve(item, lang));
  }
  if (value !== null && typeof value === 'object') {
    if (isLocalized(value)) {
      return isEmpty(value[lang]) ? value[DEFAULT_LANG] : value[lang];
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, resolve(child, lang)]),
    );
  }
  return value;
}
