import { Component } from '@angular/core';

/** Call to action that navigates (design system, 8.7): `<a appArrowLink …>Label</a>`. */
@Component({
  selector: 'a[appArrowLink]',
  host: { class: 't-nav' },
  template: `<span class="text"><ng-content /></span
    ><span class="arrow" aria-hidden="true">&nbsp;→</span>`,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      min-height: var(--target-size);
      color: var(--color-ink);
    }

    .text {
      text-decoration: underline 1px var(--color-accent);
      text-underline-offset: 6px;
    }

    .arrow {
      transition: transform var(--transition);
    }

    :host(:hover) {
      color: var(--color-accent);
    }

    @media (prefers-reduced-motion: no-preference) {
      :host(:hover) .arrow {
        transform: translateX(var(--space-1));
      }
    }
  `,
})
export class ArrowLink {}
