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
      color: var(--text);
    }

    .text {
      text-decoration: underline 2px;
      text-underline-offset: 6px;
    }

    :host(:hover) .text {
      padding: 0 0.12em;
      background: var(--highlight-bg);
      color: var(--highlight-text);
      text-decoration: none;
    }
  `,
})
export class ArrowLink {}
