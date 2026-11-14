import { Component, input } from '@angular/core';
import { InDevelopmentItem, Resolved } from '../core/content.models';
import { dotJoin } from '../core/text';
import { InlineText } from './inline-text';

/** Projects in development (design system, 8.22). No links. */
@Component({
  selector: 'app-in-development-list',
  imports: [InlineText],
  template: `
    <ul>
      @for (item of items(); track item.slug) {
        <li>
          <h3 class="t-h3 t-film-title" [attr.lang]="item.titleLang">{{ item.title }}</h3>
          <p class="t-small t-muted">{{ line(item.format) }}</p>
          @if (item.description) {
            <p class="t-body"><app-inline-text [text]="item.description" /></p>
          }
        </li>
      }
    </ul>
  `,
  styles: `
    li {
      padding-block: var(--space-4);
      border-top: var(--hairline);

      &:last-child {
        border-bottom: var(--hairline);
      }
    }
  `,
})
export class InDevelopmentList {
  readonly items = input.required<Resolved<InDevelopmentItem>[]>();
  protected readonly line = dotJoin;
}
