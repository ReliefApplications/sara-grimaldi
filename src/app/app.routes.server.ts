import { RenderMode, ServerRoute } from '@angular/ssr';
import films from '../../.generated/content/collections/films.json';
import { LANGS, RoutedPageId } from './core/content.models';
import { PAGE_PATHS } from './core/site-routes';

const PAGES = Object.keys(PAGE_PATHS) as RoutedPageId[];
const join = (...parts: string[]) => parts.filter((part) => part !== '').join('/');

/**
 * Which pages are turned into static HTML files at build time: every page in
 * both languages and every published film. Anything else (unknown addresses)
 * is handled in the browser through 404.html.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  ...LANGS.flatMap((lang): ServerRoute[] => [
    ...PAGES.map((page): ServerRoute => ({
      path: join(lang, PAGE_PATHS[page][lang]),
      renderMode: RenderMode.Prerender,
    })),
    {
      path: join(lang, PAGE_PATHS.films[lang], ':slug'),
      renderMode: RenderMode.Prerender,
      getPrerenderParams: async () => films.map((film) => ({ slug: film.slug })),
    },
  ]),
  { path: '**', renderMode: RenderMode.Client },
];
