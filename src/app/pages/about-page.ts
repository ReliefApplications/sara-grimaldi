import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { PageHeading } from '../core/page-heading';
import { InDevelopmentList } from '../shared/in-development-list';
import { InlineText } from '../shared/inline-text';

/** About. Content and structure only: not yet built to the design system (9.5). */
@Component({
  selector: 'app-about-page',
  imports: [RouterLink, PageHeading, InDevelopmentList, InlineText],
  template: `
    @if (page(); as page) {
      <div class="container plain-page">
        <h1 class="t-label" appPageHeading>{{ page.heading }}</h1>
        <p class="t-lead">{{ page.opening }}</p>
        @for (paragraph of page.biography; track $index) {
          <p><app-inline-text [text]="paragraph" /></p>
        }

        <h2 class="t-h2">{{ page.careerHeading }}</h2>
        <dl>
          @for (row of page.career; track $index) {
            <dt>{{ row.period }}</dt>
            <dd><app-inline-text [text]="row.text" /></dd>
          }
        </dl>

        <h2 class="t-h2">{{ page.collaborationsHeading }}</h2>
        <dl>
          @for (entry of collaborations(); track entry.slug) {
            <dt>{{ entry.names.join(', ') }}</dt>
            <dd><app-inline-text [text]="entry.role" /></dd>
          }
        </dl>

        @if (inDevelopment(); as items) {
          <h2 class="t-h2">{{ page.inDevelopmentHeading }}</h2>
          <app-in-development-list [items]="items" />
        }

        <p>
          <a [routerLink]="route.link('films')">{{ page.filmsLink }}</a>
        </p>
        <p>
          <a [routerLink]="route.link('contact')">{{ page.contactLink }}</a>
        </p>
      </div>
    }
  `,
})
export class AboutPage {
  private readonly content = inject(ContentService);
  protected readonly route = inject(CurrentRouteService);

  protected readonly page = this.content.page('about');
  protected readonly collaborations = this.content.collaborations();
  protected readonly inDevelopment = this.content.inDevelopment();
}
