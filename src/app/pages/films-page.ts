import { ViewportScroller } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  effect,
  inject,
  Injector,
  untracked,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FAMILIES } from '../core/content.models';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { PageHeading } from '../core/page-heading';
import { IMAGE_SIZES } from '../shared/content-image';
import { FilmTile } from '../shared/film-tile';

/** Films index (design system, 10.1): every published film, by family. */
@Component({
  selector: 'app-films-page',
  imports: [RouterLink, PageHeading, FilmTile],
  templateUrl: './films-page.html',
  styleUrl: './films-page.scss',
})
export class FilmsPage {
  private readonly content = inject(ContentService);
  protected readonly route = inject(CurrentRouteService);

  protected readonly site = this.content.site;
  protected readonly page = this.content.page('films');
  private readonly films = this.content.films();
  protected readonly sizes = IMAGE_SIZES.half;

  constructor() {
    // Arriving from another page with "#family" (e.g. from the home page): the
    // router scrolls before this page has its content, so scroll once it has.
    const fragment = inject(ActivatedRoute).snapshot.fragment;
    const scroller = inject(ViewportScroller);
    const injector = inject(Injector);
    let done = false;
    effect(() => {
      if (fragment && !done && this.page() && this.site() && this.families().length) {
        done = true;
        untracked(() => afterNextRender(() => scroller.scrollToAnchor(fragment), { injector }));
      }
    });
  }

  /** Families that have films, in their fixed order, each film with its index number. */
  protected readonly families = computed(() => {
    const all = this.films() ?? [];
    return FAMILIES.map((id) => ({
      id,
      films: all
        .map((film, index) => ({ film, number: index + 1 }))
        .filter((entry) => entry.film.family === id),
    })).filter((family) => family.films.length > 0);
  });
}
