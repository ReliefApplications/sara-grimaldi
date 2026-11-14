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
        <li><app-logo class="mark" [name]="name" size="grid" /></li>
      }
    </ul>
  `,
  styles: `
    // Inner lines only. Vertical lines are drawn behind the whole grid, one
    // per column, so they also run through the empty cells of a last row
    // that is not full; each cell draws the line below it. The list is
    // clipped by one pixel on the right and at the bottom.
    :host {
      --columns: 2;

      display: block;
      overflow: hidden;
      border-block: var(--rule);

      @media (min-width: 48rem) {
        --columns: 5;
      }
    }

    ul {
      display: grid;
      grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
      margin: 0 -1px -1px 0;
      background-image: linear-gradient(
        to right,
        transparent calc(100% - 1px),
        var(--color-ink) calc(100% - 1px)
      );
      background-size: calc(100% / var(--columns)) 100%;
    }

    .mark {
      max-width: 100%;
      max-height: 100%;
    }

    li {
      display: grid;
      place-items: center;
      --room-h: 2.5rem; // the cell height less the 16 px margins

      height: 4.5rem; // 72 px cell (8.16); not on the spacing scale
      // A logo or a name never comes closer than 16 px to the cell's edge.
      padding: var(--space-4);
      border-bottom: var(--rule-minor);

      @media (min-width: 48rem) {
        --room-h: 5rem;

        height: 7rem; // 112 px
      }

      @media (min-width: 80rem) {
        --room-h: 6.5rem;

        height: 8.5rem; // 136 px
      }
    }
  `,
})
export class LogoGrid {
  /** Organisation names, in display order. */
  readonly names = input.required<string[]>();
}
