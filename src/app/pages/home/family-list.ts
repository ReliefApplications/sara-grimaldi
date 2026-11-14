import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FAMILIES } from '../../core/content.models';
import { ContentService } from '../../core/content.service';
import { CurrentRouteService } from '../../core/current-route';

/** The three film families with their number of films (design system, 8.10). */
@Component({
  selector: 'app-family-list',
  imports: [RouterLink],
  template: `
    @if (site(); as site) {
      <ul>
        @for (family of families(); track family.id) {
          <li>
            <a class="row" [routerLink]="route.link('films')" [fragment]="family.id">
              <span class="name t-h3">{{ site.families[family.id] }}</span>&ngsp;
              <span class="count t-label t-muted t-tabular"
                >{{ family.count }}
                {{ family.count === 1 ? site.ui.filmCountOne : site.ui.filmCountOther }}</span
              >
            </a>
          </li>
        }
      </ul>
    }
  `,
  styles: `
    li {
      border-top: var(--hairline);

      &:last-child {
        border-bottom: var(--hairline);
      }
    }

    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      min-height: 3.5rem; // 56 px row (8.10); not on the spacing scale
      padding-block: var(--space-2);
    }

    .name {
      transition: color var(--transition);
    }

    .count {
      flex: none;
    }

    .row:hover .name {
      color: var(--color-accent);
    }
  `,
})
export class FamilyList {
  private readonly content = inject(ContentService);
  protected readonly route = inject(CurrentRouteService);
  protected readonly site = this.content.site;
  private readonly films = this.content.films();

  /** Families that have at least one published film, in their fixed order. */
  protected readonly families = computed(() =>
    FAMILIES.map((id) => ({
      id,
      count: (this.films() ?? []).filter((film) => film.family === id).length,
    })).filter((family) => family.count > 0),
  );
}
