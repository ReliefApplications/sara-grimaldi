import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Film, Resolved } from '../../core/content.models';
import { ContentService } from '../../core/content.service';
import { CurrentRouteService } from '../../core/current-route';
import { dotJoin } from '../../core/text';
import { ArrowLink } from '../../shared/arrow-link';
import { ContentImage, IMAGE_SIZES } from '../../shared/content-image';

/** Larger presentation of a featured film on the home page (design system, 8.13). */
@Component({
  selector: 'app-film-feature',
  imports: [RouterLink, ArrowLink, ContentImage],
  templateUrl: './film-feature.html',
  styleUrl: './film-feature.scss',
  host: { '[class.reversed]': 'reversed()' },
})
export class FilmFeature {
  private readonly content = inject(ContentService);
  protected readonly route = inject(CurrentRouteService);
  protected readonly site = this.content.site;
  protected readonly sizes = IMAGE_SIZES.feature;

  readonly film = input.required<Resolved<Film>>();
  /** Even features put the text on the left at lg. */
  readonly reversed = input(false);
  /** Label of the link to the film page. */
  readonly linkLabel = input.required<string>();

  protected readonly meta = computed(() => {
    const film = this.film();
    return dotJoin([film.year, film.duration, film.roles.join(', ')]);
  });
}
