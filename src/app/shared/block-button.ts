import { Component } from '@angular/core';

/**
 * Full-width call to action (design system, 8.7): `<a appBlockButton …>Label</a>`.
 * Its colours follow the surface it sits on.
 */
@Component({
  selector: 'a[appBlockButton]',
  host: { class: 't-title' },
  template: `<span><ng-content /></span><span aria-hidden="true">→</span>`,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      width: 100%;
      min-height: var(--space-8);
      padding: var(--space-2) var(--space-5);
      border: 2px solid var(--text);
      color: var(--text);

      @media (min-width: 48rem) {
        min-height: 4.5rem; // 72 px (8.7); not on the spacing scale
      }
    }

    :host(:hover),
    :host(:focus-visible) {
      border-color: var(--button-hover-bg, var(--text));
      background: var(--button-hover-bg, var(--text));
      color: var(--button-hover-text, var(--surface));
    }
  `,
})
export class BlockButton {}
