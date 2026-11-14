import { Component, computed, inject } from '@angular/core';
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
import { NameWall } from '../../shared/name-wall';

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
    NameWall,
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
  private readonly allCollaborations = this.content.collaborations();

  protected readonly sizes = IMAGE_SIZES;

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

  /** Each publication once, in press order. */
  protected readonly pressBand = computed<BandItem[]>(() =>
    [...new Set((this.allPress() ?? []).map((item) => item.publication))].map((text) => ({ text })),
  );

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

  /** Names of the collaborations flagged for the home page, in order. */
  protected readonly collaborators = computed(() =>
    (this.allCollaborations() ?? [])
      .filter((entry) => entry.home)
      .flatMap((entry) => entry.names)
      .map((name) => ({ name })),
  );
}
