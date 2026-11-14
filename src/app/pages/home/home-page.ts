import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { CurrentRouteService } from '../../core/current-route';
import { dotJoin } from '../../core/text';
import { PageHeading } from '../../core/page-heading';
import { ArrowLink } from '../../shared/arrow-link';
import { InDevelopmentList } from '../../shared/in-development-list';
import { PressRow } from '../../shared/press-row';
import { FamilyList } from './family-list';
import { FilmFeature } from './film-feature';

/** Home page (design system, 9.1). */
@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    PageHeading,
    ArrowLink,
    FamilyList,
    FilmFeature,
    PressRow,
    InDevelopmentList,
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
  private readonly allInDevelopment = this.content.inDevelopment();

  /** The statement split around the phrase to set in italic, if any. */
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

  protected readonly roles = computed(() => dotJoin(this.site()?.roles ?? []));

  /** The films named in content, in that order; at most three (design system, 9.1). */
  protected readonly featured = computed(() => {
    const films = this.films() ?? [];
    return (this.page()?.featured.films ?? [])
      .flatMap((slug) => films.filter((film) => film.slug === slug))
      .slice(0, 3);
  });

  protected readonly press = computed(() =>
    (this.allPress() ?? []).slice(0, this.page()?.press.count ?? 0),
  );

  /** Names of the collaborations flagged for the home page, in order. */
  protected readonly collaborators = computed(() =>
    (this.allCollaborations() ?? []).filter((entry) => entry.home).flatMap((entry) => entry.names),
  );

  protected readonly inDevelopment = computed(() =>
    (this.allInDevelopment() ?? []).filter((item) => item.home),
  );
}
