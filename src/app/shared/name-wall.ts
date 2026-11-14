import { Component, input } from '@angular/core';
import { InlineText } from './inline-text';

export interface NameWallRow {
  name: string;
  /** Shown in the detailed form only (About page). */
  role?: string;
}

/**
 * Collaborators' names set large, as ruled rows filling one, two or three
 * columns (design system, 8.9). For an ink surface.
 */
@Component({
  selector: 'app-name-wall',
  imports: [InlineText],
  template: `
    <ul>
      @for (row of rows(); track row.name) {
        <li>
          <span class="name t-title">{{ row.name }}</span>
          @if (row.role) {
            <span class="role t-small t-muted"><app-inline-text [text]="row.role" /></span>
          }
        </li>
      }
    </ul>
  `,
  styles: `
    ul {
      columns: 1;
      column-gap: var(--space-7);

      @media (min-width: 48rem) {
        columns: 2;
      }

      @media (min-width: 80rem) {
        columns: 3;
      }
    }

    // A rule above each row and below the last of each column: every row has
    // both, and overlaps the one before it by the rule's thickness. The role
    // sits at the right of the name when both fit on one line, under it
    // otherwise.
    li {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      align-content: center;
      justify-content: space-between;
      gap: var(--space-1) var(--space-4);
      min-height: var(--space-8);
      margin-top: -1px;
      padding-block: var(--space-4);
      border-block: var(--rule-on-ink);
      break-inside: avoid;

      @media (min-width: 48rem) {
        min-height: 5rem; // 80 px row (8.9); not on the spacing scale
      }
    }

    .name {
      overflow-wrap: break-word;
    }
  `,
})
export class NameWall {
  readonly rows = input.required<NameWallRow[]>();
}
