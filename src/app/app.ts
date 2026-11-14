import { Location, ViewportScroller } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LANGS } from './core/content.models';
import { LEGAL_PAGE_IDS } from './core/content-rules';
import { ContentService } from './core/content.service';
import { CurrentRouteService } from './core/current-route';
import { HeadingFocusService } from './core/page-heading';
import { PageMeta, SeoService } from './core/seo.service';
import { pageLink } from './core/site-routes';
import { SiteFooter } from './layout/site-footer';
import { SiteHeader } from './layout/site-header';
import { PrivacyNotice } from './layout/privacy-notice';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter, PrivacyNotice],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly content = inject(ContentService);
  private readonly route = inject(CurrentRouteService);
  private readonly seo = inject(SeoService);
  private readonly location = inject(Location);
  private readonly main = viewChild<ElementRef<HTMLElement>>('main');

  protected readonly site = this.content.site;

  /** A bare "#contenu" would resolve against the base href, not the current page. */
  protected readonly skipHref = computed(
    () => this.location.prepareExternalUrl(this.route.path()) + '#contenu',
  );

  constructor() {
    inject(HeadingFocusService);
    // Anchor targets stop 96 px below the top of the window (design system, 6).
    inject(ViewportScroller).setOffset([0, 96]);
    effect(() => {
      const meta = this.pageMeta();
      if (meta) {
        this.seo.update(meta);
      }
    });
  }

  /** Title, description and sharing data of the current page. */
  private pageMeta(): PageMeta | undefined {
    const site = this.site();
    const build = this.content.build();
    const page = this.route.page();
    if (!site || !build || !page) {
      return undefined;
    }
    const lang = this.route.lang();
    const slug = this.route.slug();
    // Before launch nothing is listed; after it, legal and not-found pages still are not.
    const robots = (always: boolean) =>
      build.noindex ? 'noindex, nofollow' : always ? 'noindex' : undefined;
    const base = { lang, siteName: site.name, robots: robots(false) };
    const image = (ref: { src: string; alt: string } | undefined) =>
      ref && { url: build.siteUrl + this.content.assetUrl(ref.src), alt: ref.alt };
    const notFound = () => {
      const seo = this.content.page('not-found')()?.seo;
      return seo
        ? ({ ...base, ...seo, type: 'website', robots: robots(true) } satisfies PageMeta)
        : undefined;
    };
    if (page === 'not-found') {
      return notFound();
    }
    const urls = Object.fromEntries(
      LANGS.map((code) => [
        code,
        build.siteUrl + pageLink(code, page, slug).slice(1).join('/') + '/',
      ]),
    ) as PageMeta['urls'];

    if (page === 'films' && slug) {
      const films = this.content.films()();
      const film = films?.find((entry) => entry.slug === slug);
      if (!film) {
        return films ? notFound() : undefined;
      }
      return {
        ...base,
        title: `${film.title} (${film.year}) – ${site.name}`,
        description: film.logline,
        type: 'video.movie',
        image: image(film.shareImage ?? site.seo.image),
        urls,
      };
    }
    const seo = this.content.page(page)()?.seo;
    const legal = (LEGAL_PAGE_IDS as readonly string[]).includes(page);
    return (
      seo && {
        ...base,
        ...seo,
        type: 'website',
        robots: robots(legal),
        image: image(site.seo.image),
        urls,
      }
    );
  }

  protected skipToMain(event: Event): void {
    event.preventDefault();
    this.main()?.nativeElement.focus();
  }
}
