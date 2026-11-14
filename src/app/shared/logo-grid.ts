import { Component, input } from '@angular/core';
import { Logo } from './logo';

/**
 * A ruled grid of organisations, each as its logo or its name (design
 * system, 8.16). For the ground surface.
 */
@Component({
  selector: 'app-logo-grid',
  imports: [Logo],
  template: `
    <ul>
      @for (name of names(); track name) {
        <li><app-logo [name]="name" size="grid" /></li>
      }
    </ul>
  `,
  styles: `
    // Inner lines only: each cell draws a line on its right and below, and
    // the list is clipped by one pixel on those two sides.
    :host {
      display: block;
      overflow: hidden;
      border-block: var(--rule);
    }

    ul {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      margin: 0 -1px -1px 0;

      @media (min-width: 48rem) {
        grid-template-columns: repeat(5, minmax(0, 1fr));
      }
    }

    li {
      display: grid;
      place-items: center;
      height: 5.5rem; // 88 px cell (8.16); not on the spacing scale
      padding: var(--space-2);
      border-right: var(--rule-minor);
      border-bottom: var(--rule-minor);

      @media (min-width: 48rem) {
        height: 7rem; // 112 px
      }

      @media (min-width: 80rem) {
        height: 8.5rem; // 136 px
      }
    }
  `,
})
export class LogoGrid {
  /** Organisation names, in display order. */
  readonly names = input.required<string[]>();
}
