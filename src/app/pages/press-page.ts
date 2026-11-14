import { Component, computed, inject } from '@angular/core';
import { PressItem, Resolved } from '../core/content.models';
import { ContentService } from '../core/content.service';
import { PageHeading } from '../core/page-heading';
import { PressRow } from '../shared/press-row';

/** Press (design system, 10.3): every item, newest first, grouped by year. */
@Component({
  selector: 'app-press-page',
  imports: [PageHeading, PressRow],
  template: `
    @if (page(); as page) {
      <div class="page-head">
        <div class="container grid">
          <h1 class="t-giant" appPageHeading>{{ page.heading }}</h1>
          <p class="intro t-lead">{{ page.intro }}</p>
        </div>
      </div>
      <div class="container body">
        @for (group of years(); track group.year) {
          <section [attr.aria-labelledby]="'year-' + group.year">
            <h2 class="year t-display t-muted t-tabular" [id]="'year-' + group.year">
              {{ group.year }}
            </h2>
            <ul class="rows">
              @for (item of group.items; track item.slug) {
                <li><app-press-row [item]="item" /></li>
              }
            </ul>
          </section>
        }
      </div>
    }
  `,
  styles: `
    .intro {
      margin-top: var(--space-5);

      @media (min-width: 80rem) {
        grid-column: 1 / 8;
      }
    }

    .body {
      padding-bottom: var(--section-pad);
    }

    .year {
      margin-block: var(--space-8) var(--space-4);
    }

    // A major rule opens each year; minor rules separate its rows.
    .rows {
      border-top: var(--rule);

      li:first-child app-press-row {
        border-top: 0;
      }
    }
  `,
})
export class PressPage {
  private readonly content = inject(ContentService);

  protected readonly page = this.content.page('press');
  private readonly press = this.content.press();

  /** Items grouped by year, newest first (the list is already in that order). */
  protected readonly years = computed(() => {
    const groups: { year: number; items: Resolved<PressItem>[] }[] = [];
    for (const item of this.press() ?? []) {
      const last = groups.at(-1);
      if (last?.year === item.year) {
        last.items.push(item);
      } else {
        groups.push({ year: item.year, items: [item] });
      }
    }
    return groups;
  });
}
