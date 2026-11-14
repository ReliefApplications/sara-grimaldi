import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FAMILIES } from '../../core/content.models';
import { ContentService } from '../../core/content.service';
import { CurrentRouteService } from '../../core/current-route';
import { PageHeading } from '../../core/page-heading';
import { ArrowLink } from '../../shared/arrow-link';
import { Band, BandItem } from '../../shared/band';
import { BlockButton } from '../../shared/block-button';
import { ContentImage, IMAGE_SIZES } from '../../shared/content-image';
import { DotLine } from '../../shared/dot-line';
import { FilmTile } from '../../shared/film-tile';
import { InlineText } from '../../shared/inline-text';
import { LogoGrid } from '../../shared/logo-grid';

/** Home page (design system, 9). */
@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    PageHeading,
    ArrowLink,
    Band,
    BlockButton,
    ContentImage,
    DotLine,
    FilmTile,
    InlineText,
    LogoGrid,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private readonly content = inject(ContentService);
  protected readonly route = inject(CurrentRouteService);

  protected readonly site = this.content.site;
  protected readonly page = this.content.page('home');
  private readonly films = this.content.films();
  private readonly allPress = this.content.press();
  private readonly organisations = this.content.organisations();

  protected readonly sizes = IMAGE_SIZES;

  private readonly sanitizer = inject(DomSanitizer);
  /** True once the visitor has asked for the showreel; only then is the player loaded. */
  protected readonly playing = signal(false);

  /** Player address, built only from a validated id (design system 7.5). */
  protected readonly reelUrl = computed<SafeResourceUrl | null>(() => {
    const reel = this.page()?.reel;
    if (!reel) {
      return null;
    }
    const url =
      reel.provider === 'vimeo' && /^\d+$/.test(reel.id)
        ? `https://player.vimeo.com/video/${reel.id}?dnt=1&autoplay=1`
        : reel.provider === 'youtube' && /^[\w-]{11}$/.test(reel.id)
          ? `https://www.youtube-nocookie.com/embed/${reel.id}?autoplay=1`
          : null;
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  /** The name on two lines below md: first name, then the rest. */
  protected readonly nameLines = computed(() => {
    const [first, ...rest] = (this.site()?.name ?? '').split(' ');
    return [first, rest.join(' ')].filter(Boolean);
  });

  /** Families and role labels interleaved: family, role, family, role… */
  protected readonly rolesBand = computed<BandItem[]>(() => {
    const site = this.site();
    if (!site) {
      return [];
    }
    return FAMILIES.flatMap((family, index): BandItem[] => [
      { text: site.families[family], link: this.route.link('films'), fragment: family },
      ...(site.roles[index] ? [{ text: site.roles[index], narrow: true }] : []),
    ]);
  });

  /** Each press outlet once, in press order, as its logo where it has one. */
  protected readonly pressBand = computed<BandItem[]>(() => {
    const byName = this.content.organisationByName();
    const outlets = (this.allPress() ?? []).map(
      (item) => byName.get(item.publication.toLowerCase())?.name ?? item.publication,
    );
    return [...new Set(outlets)].map((text) => ({ text, logo: true }));
  });

  /** The statement split around the phrase to set as the accent word, if any. */
  protected readonly statement = computed(() => {
    const page = this.page();
    const text = page?.statement ?? '';
    const emphasis = page?.statementEmphasis ?? '';
    const start = emphasis ? text.indexOf(emphasis) : -1;
    return start < 0
      ? { before: text, emphasis: '', after: '' }
      : {
          before: text.slice(0, start),
          emphasis,
          after: text.slice(start + emphasis.length),
        };
  });

  /** The films named in content, in that order; at most three. */
  protected readonly featured = computed(() => {
    const films = this.films() ?? [];
    return (this.page()?.featured.films ?? [])
      .flatMap((slug) => films.filter((film) => film.slug === slug))
      .slice(0, 3);
  });

  /** Organisations flagged for the home page: those with a logo first, then the names. */
  protected readonly collaborators = computed(() => {
    const home = (this.organisations() ?? []).filter((entry) => entry.home);
    return [...home.filter((entry) => entry.logo), ...home.filter((entry) => !entry.logo)].map(
      (entry) => entry.name,
    );
  });
}
