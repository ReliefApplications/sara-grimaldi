import { Component, inject } from '@angular/core';
import { ContentService } from '../core/content.service';
import { PageHeading } from '../core/page-heading';

/** Contact. Content and structure only: not yet built to the design system (9.6). */
@Component({
  selector: 'app-contact-page',
  imports: [PageHeading],
  template: `
    @if (page(); as page) {
      @if (site(); as site) {
        <div class="container plain-page">
          <h1 class="t-label" appPageHeading>{{ page.heading }}</h1>
          <p class="t-display">{{ site.footer.invitation }}</p>
          <p class="t-lead">{{ page.intro }}</p>
          <dl>
            <dt>{{ site.ui.email }}</dt>
            <dd>
              <a [href]="'mailto:' + site.contact.email">{{ site.contact.email }}</a>
            </dd>
            @if (page.phone?.number && page.phone?.display) {
              <dt>{{ page.labels.phone }}</dt>
              <dd>
                <a [href]="'tel:' + page.phone?.number">{{ page.phone?.display }}</a>
              </dd>
            }
            <dt>{{ page.labels.location }}</dt>
            <dd>{{ page.location }}</dd>
            <dt>{{ page.labels.social }}</dt>
            @for (link of site.social; track link.url) {
              <dd>
                <a [href]="link.url" target="_blank" rel="noopener noreferrer"
                  >{{ link.label }} <span class="t-arrow-out" aria-hidden="true">→</span>
                  <span class="visually-hidden">{{ site.ui.newWindow }}</span></a
                >
              </dd>
            }
            @if (page.secondaryContact; as contact) {
              <dt>{{ contact.heading }}</dt>
              <dd>
                {{ contact.name }}&nbsp;·
                <a [href]="'mailto:' + contact.email">{{ contact.email }}</a>
              </dd>
            }
          </dl>
        </div>
      }
    }
  `,
})
export class ContactPage {
  private readonly content = inject(ContentService);

  protected readonly site = this.content.site;
  protected readonly page = this.content.page('contact');
}
