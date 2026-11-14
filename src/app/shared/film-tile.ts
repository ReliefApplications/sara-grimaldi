import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Film, Resolved } from '../core/content.models';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { ContentImage } from './content-image';
import { DotLine } from './dot-line';

/**
 * A film as a link: image tile, index number, title and meta line (design
 * system, 8.8). The parent sets the tile's proportions with `ratio` and the
 * image `sizes` for its layout.
 */
@Component({
  selector: 'app-film-tile',
  imports: [RouterLink, ContentImage, DotLine],
  templateUrl: './film-tile.html',
  styleUrl: './film-tile.scss',
  host: { '[class.lead]': 'lead()' },
})
export class FilmTile {
  protected readonly route = inject(CurrentRouteService);
  protected readonly site = inject(ContentService).site;

  readonly film = input.required<Resolved<Film>>();
  /** Position in the list, starting at 1; shown as "01". */
  readonly index = input.required<number>();
  readonly sizes = input.required<string>();
  /** The lead film of the home page has a larger title. */
  readonly lead = input(false);
  /** Heading level of the title, to fit the page outline. */
  readonly level = input<2 | 3>(3);

  protected readonly number = computed(() => String(this.index()).padStart(2, '0'));
  protected readonly meta = computed(() => {
    const film = this.film();
    return [this.site()?.families[film.family], film.year, film.duration];
  });
}
