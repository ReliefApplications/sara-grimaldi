import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { PageHeading } from '../core/page-heading';
import { BlockButton } from '../shared/block-button';

/** Not found (design system, 10.7), in the language of the URL prefix. */
@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, PageHeading, BlockButton],
  template: `
    @if (page(); as page) {
      <div class="container grid wrap">
        <h1 class="t-giant" appPageHeading>{{ page.code }}</h1>
        <p class="text t-lead">{{ page.heading }}</p>
        <a class="home" appBlockButton [routerLink]="route.link('home')">{{ page.homeLink }}</a>
      </div>
    }
  `,
  styles: `
    .wrap {
      padding-block: calc(var(--section-pad) * 2);
    }

    .text {
      margin-top: var(--space-4);
    }

    .home {
      margin-top: var(--space-6);

      @media (min-width: 80rem) {
        grid-column: 1 / 7;
      }
    }
  `,
})
export class NotFoundPage {
  protected readonly route = inject(CurrentRouteService);
  protected readonly page = inject(ContentService).page('not-found');
}
