import { Component, input } from '@angular/core';
import { InlineText } from './inline-text';

export interface DataRow {
  label: string;
  value: string;
}

/** Label and value rows (design system, 8.12): film data, career timeline. */
@Component({
  selector: 'app-data-list',
  imports: [InlineText],
  template: `
    <dl>
      @for (row of rows(); track row.label) {
        <div class="row">
          <dt class="t-label t-muted t-tabular">{{ row.label }}</dt>
          <dd class="t-body"><app-inline-text [text]="row.value" /></dd>
        </div>
      }
    </dl>
  `,
  styles: `
    .row {
      padding-block: var(--space-3);
      border-top: var(--minor-rule, var(--rule-minor));

      &:last-child {
        border-bottom: var(--minor-rule, var(--rule-minor));
      }

      @media (min-width: 48rem) {
        display: grid;
        grid-template-columns: 10rem minmax(0, 1fr); // 160 px label column (8.12)
        column-gap: var(--space-5);
        align-items: baseline;
      }
    }

    dt {
      margin-bottom: var(--space-1);
    }
  `,
})
export class DataList {
  readonly rows = input.required<DataRow[]>();
}
