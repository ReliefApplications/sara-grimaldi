import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LegalPageId } from '../core/content.models';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { PageHeading } from '../core/page-heading';
import { ArrowLink } from '../shared/arrow-link';
import { InlineText } from '../shared/inline-text';

/** British rather than American date order in English: "14 November 2026". */
const DATE_LOCALES = { fr: 'fr-FR', en: 'en-GB' } as const;

/** Legal notice and privacy policy: same layout, different content (design system, 9.8). */
@Component({
  selector: 'app-legal-page',
  imports: [RouterLink, PageHeading, ArrowLink, InlineText],
  templateUrl: './legal-page.html',
  styleUrl: './legal-page.scss',
})
export class LegalPage {
  private readonly content = inject(ContentService);
  protected readonly route = inject(CurrentRouteService);
  protected readonly site = this.content.site;

  private readonly id = computed<LegalPageId>(() =>
    this.route.page() === 'privacy' ? 'privacy' : 'legal',
  );
  protected readonly other = computed<LegalPageId>(() =>
    this.id() === 'legal' ? 'privacy' : 'legal',
  );
  protected readonly page = computed(() => this.content.page(this.id())());

  /** The date written out in the language of the page, e.g. "14 novembre 2026". */
  protected readonly updated = computed(() => {
    const date = new Date(`${this.page()?.updated}T00:00:00Z`);
    return Number.isNaN(date.getTime())
      ? undefined
      : new Intl.DateTimeFormat(DATE_LOCALES[this.route.lang()], {
          dateStyle: 'long',
          timeZone: 'UTC',
        }).format(date);
  });
}
