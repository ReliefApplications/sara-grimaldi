import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { PageHeading } from '../core/page-heading';
import { ArrowLink } from '../shared/arrow-link';

/** Not found (design system, 8.25), in the language of the URL prefix. */
@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, PageHeading, ArrowLink],
  template: `
    @if (page(); as page) {
      <div class="container">
        <p class="t-label t-muted">{{ page.code }}</p>
        <h1 class="t-display" appPageHeading>{{ page.heading }}</h1>
        <a appArrowLink [routerLink]="route.link('home')">{{ page.homeLink }}</a>
      </div>
    }
  `,
  styles: `
    .container {
      padding-block: var(--space-9);
      text-align: center;
    }

    h1 {
      margin-block: var(--space-4) var(--space-6);
    }
  `,
})
export class NotFoundPage {
  protected readonly route = inject(CurrentRouteService);
  protected readonly page = inject(ContentService).page('not-found');
}
