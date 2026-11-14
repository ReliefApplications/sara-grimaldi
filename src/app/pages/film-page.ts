import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FILM_DATA_KEYS } from '../core/content.models';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { PageHeading } from '../core/page-heading';
import { BlockButton } from '../shared/block-button';
import { ContentImage, IMAGE_SIZES } from '../shared/content-image';
import { DataList, DataRow } from '../shared/data-list';
import { DotLine } from '../shared/dot-line';
import { InlineText } from '../shared/inline-text';
import { PressRow } from '../shared/press-row';
import { NotFoundPage } from './not-found-page';

/** How many selections are listed before the rest is folded away (10.2). */
const SELECTIONS_SHOWN = 12;

/** Film page (design system, 10.2). */
@Component({
  selector: 'app-film-page',
  imports: [
    NgTemplateOutlet,
    RouterLink,
    PageHeading,
    NotFoundPage,
    BlockButton,
    ContentImage,
    DataList,
    DotLine,
    InlineText,
    PressRow,
  ],
  templateUrl: './film-page.html',
  styleUrl: './film-page.scss',
})
export class FilmPage {
  private readonly content = inject(ContentService);
  protected readonly route = inject(CurrentRouteService);

  protected readonly site = this.content.site;
  protected readonly page = this.content.page('films');
  protected readonly films = this.content.films();
  private readonly allPress = this.content.press();
  protected readonly sizes = IMAGE_SIZES;

  protected readonly film = computed(() =>
    this.films()?.find((entry) => entry.slug === this.route.slug()),
  );

  /** Family, year, duration, roles: the line under the title. */
  protected readonly dataLine = computed(() => {
    const film = this.film();
    return film
      ? [this.site()?.families[film.family], film.year, film.duration, film.roles.join(', ')]
      : [];
  });

  /** Rows of the data list that have a value, in display order. */
  protected readonly data = computed<DataRow[]>(() => {
    const film = this.film();
    const labels = this.page()?.labels;
    if (!film || !labels) {
      return [];
    }
    return [
      { label: labels.year, value: String(film.year) },
      { label: labels.duration, value: film.duration },
      ...FILM_DATA_KEYS.map((key) => ({ label: labels[key], value: film.data?.[key] })),
    ].filter((row): row is DataRow => !!row.value);
  });

  protected readonly selections = computed(() => {
    const all = this.film()?.selections ?? [];
    return { shown: all.slice(0, SELECTIONS_SHOWN), more: all.slice(SELECTIONS_SHOWN) };
  });

  protected readonly press = computed(() =>
    (this.allPress() ?? []).filter((item) => item.relatedFilm === this.route.slug()),
  );

  /** The films before and after this one in index order, wrapping around. */
  protected readonly neighbours = computed(() => {
    const films = this.films() ?? [];
    const index = films.findIndex((entry) => entry.slug === this.route.slug());
    if (index < 0 || films.length < 2) {
      return undefined;
    }
    return {
      previous: films[(index - 1 + films.length) % films.length],
      next: films[(index + 1) % films.length],
    };
  });
}
