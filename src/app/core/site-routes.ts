import { Route, Routes } from '@angular/router';
import { LEGAL_PAGE_IDS, NAV_PAGE_IDS } from './content-rules';
import { DEFAULT_LANG, Lang, LANGS, NavPageId, PageId, RoutedPageId } from './content.models';

/** URL segment of each page, per language. The single place to change URLs. */
export const PAGE_PATHS: Record<RoutedPageId, Record<Lang, string>> = {
  home: { fr: '', en: '' },
  films: { fr: 'films', en: 'films' },
  press: { fr: 'presse', en: 'press' },
  about: { fr: 'a-propos', en: 'about' },
  contact: { fr: 'contact', en: 'contact' },
  legal: { fr: 'mentions-legales', en: 'legal-notice' },
  privacy: { fr: 'confidentialite', en: 'privacy' },
};

/** Pages of the main navigation, in display order. */
export const NAV_PAGES: readonly NavPageId[] = NAV_PAGE_IDS;

/** Data attached to every route so the app knows its language and page. */
export interface RouteInfo {
  lang: Lang;
  page: PageId;
}

/** Router link (absolute) to a page in a language, e.g. ['/', 'en', 'films', 'immunity']. */
export function pageLink(lang: Lang, page: PageId, slug?: string): string[] {
  const segment = page === 'not-found' ? '' : PAGE_PATHS[page][lang];
  return ['/', lang, segment, slug ?? ''].filter((part) => part !== '');
}

function langRoute(lang: Lang): Route {
  const info = (page: PageId): RouteInfo => ({ lang, page });
  const path = (page: RoutedPageId) => PAGE_PATHS[page][lang];
  return {
    path: lang,
    children: [
      {
        path: path('home'),
        pathMatch: 'full',
        data: info('home'),
        loadComponent: () => import('../pages/home/home-page').then((m) => m.HomePage),
      },
      {
        path: path('films'),
        data: info('films'),
        loadComponent: () => import('../pages/films-page').then((m) => m.FilmsPage),
      },
      {
        path: `${path('films')}/:slug`,
        data: info('films'),
        loadComponent: () => import('../pages/film-page').then((m) => m.FilmPage),
      },
      {
        path: path('press'),
        data: info('press'),
        loadComponent: () => import('../pages/press-page').then((m) => m.PressPage),
      },
      {
        path: path('about'),
        data: info('about'),
        loadComponent: () => import('../pages/about-page').then((m) => m.AboutPage),
      },
      {
        path: path('contact'),
        data: info('contact'),
        loadComponent: () => import('../pages/contact-page').then((m) => m.ContactPage),
      },
      ...LEGAL_PAGE_IDS.map((page): Route => ({
        path: path(page),
        data: info(page),
        loadComponent: () => import('../pages/legal-page').then((m) => m.LegalPage),
      })),
      {
        path: '**',
        data: info('not-found'),
        loadComponent: () => import('../pages/not-found-page').then((m) => m.NotFoundPage),
      },
    ],
  };
}

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: DEFAULT_LANG },
  ...LANGS.map(langRoute),
  {
    path: '**',
    data: { lang: DEFAULT_LANG, page: 'not-found' } satisfies RouteInfo,
    loadComponent: () => import('../pages/not-found-page').then((m) => m.NotFoundPage),
  },
];
