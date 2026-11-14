import { Component, computed, inject } from '@angular/core';
import { PressItem, Resolved } from '../core/content.models';
import { ContentService } from '../core/content.service';
import { PageHeading } from '../core/page-heading';
import { PressRow } from '../shared/press-row';

/** Press. Content and structure only: not yet built to the design system (9.4). */
@Component({
  selector: 'app-press-page',
  imports: [PageHeading, PressRow],
  template: `
    @if (page(); as page) {
      <div class="container plain-page">
        <h1 class="t-display-l" appPageHeading>{{ page.heading }}</h1>
        <p>{{ page.intro }}</p>
        @for (group of years(); track group.year) {
          <h2 class="t-label t-muted t-tabular">{{ group.year }}</h2>
          <ul>
            @for (item of group.items; track item.slug) {
              <li><app-press-row [item]="item" /></li>
            }
          </ul>
        }
      </div>
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
