import { Component, input } from '@angular/core';

/**
 * A line of short items separated by record dots (design system, 6.3), e.g.
 * "Fiction ● 2024 ● 9 min". A list for assistive technology, built from
 * spans so it can sit inside a paragraph; each dot stays with the item
 * before it, so no line starts with a dot.
 */
@Component({
  selector: 'app-dot-line',
  // Kept on one line: whitespace between the parts would show up as extra spaces.
  // prettier-ignore
  template: `<span role="list">@for (item of shown(); track $index) {<span role="listitem">{{ item }}@if (!$last) {&#8288;<span class="dot" aria-hidden="true"></span>}</span>}</span>`,
  styles: `
    .dot {
      margin-inline: 0.7em;
    }
  `,
})
export class DotLine {
  readonly items = input.required<(string | number | undefined | null)[]>();

  protected shown(): (string | number)[] {
    return this.items().filter(
      (item): item is string | number => item !== undefined && item !== null && item !== '',
    );
  }
}
