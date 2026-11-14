import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import collaborations from '../../.generated/content/collections/collaborations.json';
import films from '../../.generated/content/collections/films.json';
import inDevelopment from '../../.generated/content/collections/in-development.json';
import press from '../../.generated/content/collections/press.json';
import about from '../../.generated/content/pages/about.json';
import filmsPage from '../../.generated/content/pages/films.json';
import contact from '../../.generated/content/pages/contact.json';
import home from '../../.generated/content/pages/home.json';
import legal from '../../.generated/content/pages/legal.json';
import notFound from '../../.generated/content/pages/not-found.json';
import privacy from '../../.generated/content/pages/privacy.json';
import site from '../../.generated/content/site.json';
import { App } from './app';
import { routes } from './core/site-routes';

/** The real files of /content, so the tests also check their shape. */
const CONTENT: Record<string, object> = {
  'content/site.json': site,
  'content/build.json': { siteUrl: 'https://example.org/site/', noindex: false },
  'content/pages/home.json': home,
  'content/pages/films.json': filmsPage,
  'content/pages/about.json': about,
  'content/pages/not-found.json': notFound,
  'content/pages/contact.json': contact,
  'content/pages/legal.json': legal,
  'content/pages/privacy.json': privacy,
  'content/collections/films.json': films,
  'content/collections/press.json': press,
  'content/collections/collaborations.json': collaborations,
  'content/collections/in-development.json': inDevelopment,
};

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let http: HttpTestingController;
  let page: HTMLElement;

  const text = (selector: string) => page.querySelector(selector)?.textContent?.trim();
  const head = (selector: string, attribute: string) =>
    document.head.querySelector(selector)?.getAttribute(attribute);

  async function open(url: string): Promise<void> {
    await TestBed.inject(Router).navigateByUrl(url);
    // Answer content requests until none are pending.
    for (let round = 0; round < 5; round++) {
      await fixture.whenStable();
      const pending = http.match(() => true);
      if (pending.length === 0) break;
      pending.forEach((request) => request.flush(CONTENT[request.request.url]));
    }
    await fixture.whenStable();
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(App);
    http = TestBed.inject(HttpTestingController);
    page = fixture.nativeElement as HTMLElement;
  });

  it('redirects the root URL to the French home page', async () => {
    await open('/');
    expect(TestBed.inject(Router).url).toBe('/fr');
    expect(document.documentElement.lang).toBe('fr');
    expect(text('h1')).toBe('Je travaille l’émotion, quel que soit le format.');
    expect(text('h1 em')).toBe('l’émotion');
    expect(document.title).toBe('Sara Grimaldi – Réalisatrice et scénariste');
  });

  it('shows featured films, family counts, press and projects on the home page', async () => {
    await open('/en');
    expect(page.querySelectorAll('app-film-feature').length).toBe(3);
    expect(text('app-family-list li:first-child')).toMatch(/^Fiction\s+2\s+films$/);
    expect(page.querySelector('app-family-list a')?.getAttribute('href')).toBe('/en/films#fiction');
    expect(page.querySelectorAll('app-press-row').length).toBe(3);
    // Third row: an article in French about Immunity, seen from the English page.
    const row = page.querySelectorAll('app-press-row')[2];
    expect(row.querySelector('cite')?.textContent).toBe('Immunity');
    expect(row.querySelector('.description')?.textContent?.trim()).toBe(
      'Article about the documentary Immunity',
    );
    expect(row.querySelector('.meta')?.textContent).toBe(
      '2024\u00A0· France\u00A0· fr – article in French',
    );
    expect(page.querySelectorAll('app-in-development-list li').length).toBe(3);
  });

  it('adds the article language to a press row only when it differs from the page', async () => {
    await open('/fr');
    const metas = [...page.querySelectorAll('app-press-row .meta')].map((meta) => meta.textContent);
    expect(metas).toEqual(['2025\u00A0· France', '2025\u00A0· France', '2024\u00A0· France']);
  });

  it('renders a page in English with its title, description and canonical links', async () => {
    await open('/en/about');
    expect(document.documentElement.lang).toBe('en');
    expect(text('h1')).toBe('About');
    expect(document.title).toBe('About – Sara Grimaldi');
    expect(head('meta[name="description"]', 'content')).toContain('director and screenwriter');
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
    expect(head('link[rel="canonical"]', 'href')).toBe('https://example.org/site/en/about/');
    expect(head('link[hreflang="fr"]', 'href')).toBe('https://example.org/site/fr/a-propos/');
    expect(head('link[hreflang="x-default"]', 'href')).toBe(
      'https://example.org/site/fr/a-propos/',
    );
  });

  it('gives a film page its own title and links the switcher to the same film', async () => {
    await open('/fr/films/immunity');
    expect(text('h1')).toBe('Immunity');
    expect(document.title).toBe('Immunity (2020) – Sara Grimaldi');
    expect(head('meta[property="og:type"]', 'content')).toBe('video.movie');
    const switcher = page.querySelector('header app-language-switcher');
    expect(switcher?.querySelector('a[hreflang="en"]')?.getAttribute('href')).toBe(
      '/en/films/immunity',
    );
    expect(switcher?.querySelector('[aria-current="true"]')?.textContent).toBe(
      'FR – langue actuelle',
    );
    expect(switcher?.querySelector('a[hreflang="en"]')?.textContent).toBe('EN – English version');
    expect(switcher?.querySelector('a[hreflang="en"]')?.hasAttribute('aria-label')).toBe(false);
  });

  it('shows the not-found page for unknown URLs and unpublished films', async () => {
    await open('/en/nope');
    expect(text('h1')).toBe('This page does not exist.');
    expect(head('meta[name="robots"]', 'content')).toBe('noindex');
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    await open('/fr/films/la-chose-qui-manque');
    expect(text('h1')).toBe('Cette page n’existe pas.');
  });

  it('shows the phone number on the Contact page only', async () => {
    const phone = site.contact.phoneDisplay;
    await open('/fr');
    expect(page.textContent).not.toContain(phone);
    expect(page.querySelector('a[href^="tel:"]')).toBeNull();
    await open('/fr/contact');
    expect(page.querySelector('main a[href^="tel:"]')?.textContent).toBe(phone);
    expect(page.querySelector('footer')?.textContent).not.toContain(phone);
  });

  it('renders the legal pages with highlighted placeholders and footer links', async () => {
    await open('/fr/mentions-legales');
    expect(text('h1')).toBe('Mentions légales');
    expect(head('meta[name="robots"]', 'content')).toBe('noindex');
    expect(page.querySelectorAll('main mark').length).toBeGreaterThan(10);
    expect(text('main mark')).toMatch(/^\[à compléter/);
    const links = [...page.querySelectorAll('footer nav a')].map((a) => a.getAttribute('href'));
    expect(links).toEqual(['/fr/mentions-legales', '/fr/confidentialite']);
    expect(page.querySelector('.cross a')?.getAttribute('href')).toBe('/fr/confidentialite');

    await open('/en/privacy');
    expect(text('h1')).toBe('Privacy policy');
    expect(document.title).toBe('Privacy – Sara Grimaldi');
    // The section about videos is switched off in content.
    expect(page.querySelector('#videos')).toBeNull();
    expect(page.querySelector('#cookies')).not.toBeNull();
    expect(
      page.querySelector('header app-language-switcher a[hreflang="fr"]')?.getAttribute('href'),
    ).toBe('/fr/confidentialite');
  });

  it('shows the privacy notice until it is dismissed, and remembers the choice', async () => {
    await open('/en');
    const notice = () => page.querySelector('app-privacy-notice aside');
    expect(notice()?.getAttribute('aria-label')).toBe('Cookies and privacy');
    expect(notice()?.querySelector('a')?.getAttribute('href')).toBe('/en/privacy');
    // It comes right after the skip link and before the header.
    expect(page.querySelector('.skip-link + app-privacy-notice + app-site-header')).not.toBeNull();

    notice()?.querySelector('button')?.click();
    await fixture.whenStable();
    expect(notice()).toBeNull();
    expect(localStorage.getItem('sg-privacy-notice')).toBe(site.privacyNotice.version);
    expect(localStorage.length).toBe(1);
  });
});
