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
import { dotJoin } from '../core/text';

/** Films index. Content and structure only: not yet built to the design system (9.2). */
@Component({
  selector: 'app-films-page',
  imports: [RouterLink, PageHeading],
  template: `
    @if (page(); as page) {
      @if (site(); as site) {
        <div class="container plain-page">
          <h1 class="t-display-l" appPageHeading>{{ page.heading }}</h1>
          <p>{{ page.intro }}</p>
          <nav [attr.aria-label]="page.familyNavLabel">
            <ul>
              @for (family of families(); track family.id) {
                <li>
                  <a [routerLink]="route.link('films')" [fragment]="family.id">{{
                    site.families[family.id]
                  }}</a>
                </li>
              }
            </ul>
          </nav>
          @for (family of families(); track family.id) {
            <section class="family" [id]="family.id">
              <h2 class="t-h2">{{ site.families[family.id] }}</h2>
              <ul>
                @for (film of family.films; track film.slug) {
                  <li>
                    <a [routerLink]="route.link('films', film.slug)" [attr.lang]="film.titleLang">{{
                      film.title
                    }}</a>
                    {{ line([film.year, film.duration, film.roles.join(', ')]) }}
                  </li>
                }
              </ul>
            </section>
          }
        </div>
      }
    }
  `,
  styles: `
    .family {
      scroll-margin-top: var(--space-9);
    }
  `,
})
export class FilmsPage {
  private readonly content = inject(ContentService);
  protected readonly route = inject(CurrentRouteService);

  protected readonly site = this.content.site;
  protected readonly page = this.content.page('films');
  protected readonly line = (parts: (string | number | undefined)[]) => '\u00A0· ' + dotJoin(parts);
  private readonly films = this.content.films();

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

  protected readonly families = computed(() =>
    FAMILIES.map((id) => ({
      id,
      films: (this.films() ?? []).filter((film) => film.family === id),
    })).filter((family) => family.films.length > 0),
  );
}
