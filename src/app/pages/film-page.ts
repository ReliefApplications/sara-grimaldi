import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FILM_DATA_KEYS } from '../core/content.models';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { PageHeading } from '../core/page-heading';
import { dotJoin } from '../core/text';
import { InlineText } from '../shared/inline-text';
import { PressRow } from '../shared/press-row';
import { NotFoundPage } from './not-found-page';

/** Film page. Content and structure only: not yet built to the design system (9.3). */
@Component({
  selector: 'app-film-page',
  imports: [RouterLink, PageHeading, NotFoundPage, InlineText, PressRow],
  templateUrl: './film-page.html',
})
export class FilmPage {
  private readonly content = inject(ContentService);
  protected readonly route = inject(CurrentRouteService);

  protected readonly site = this.content.site;
  protected readonly page = this.content.page('films');
  protected readonly films = this.content.films();
  protected readonly line = dotJoin;
  private readonly allPress = this.content.press();

  protected readonly film = computed(() =>
    this.films()?.find((entry) => entry.slug === this.route.slug()),
  );

  /** Rows of the data table that have a value, in display order. */
  protected readonly data = computed(() => {
    const film = this.film();
    const labels = this.page()?.labels;
    if (!film || !labels) {
      return [];
    }
    return [
      { label: labels.year, value: String(film.year) },
      { label: labels.duration, value: film.duration },
      ...FILM_DATA_KEYS.map((key) => ({ label: labels[key], value: film.data?.[key] })),
    ].filter((row) => row.value);
  });

  protected readonly press = computed(() =>
    (this.allPress() ?? []).filter((item) => item.relatedFilm === this.route.slug()),
  );
}
