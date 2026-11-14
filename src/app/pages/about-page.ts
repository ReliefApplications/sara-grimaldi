import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { PageHeading } from '../core/page-heading';
import { BlockButton } from '../shared/block-button';
import { ContentImage } from '../shared/content-image';
import { DataList } from '../shared/data-list';
import { DotLine } from '../shared/dot-line';
import { InlineText } from '../shared/inline-text';
import { LogoGrid } from '../shared/logo-grid';
import { NameWall } from '../shared/name-wall';

/** About (design system, 10.4). */
@Component({
  selector: 'app-about-page',
  imports: [
    RouterLink,
    PageHeading,
    BlockButton,
    ContentImage,
    DataList,
    DotLine,
    InlineText,
    LogoGrid,
    NameWall,
  ],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutPage {
  protected readonly content = inject(ContentService);
  protected readonly route = inject(CurrentRouteService);

  protected readonly page = this.content.page('about');
  private readonly organisations = this.content.organisations();
  protected readonly inDevelopment = this.content.inDevelopment();

  /** Portrait: full width below md, 4 of 8 columns at md, 5 of 12 at lg. */
  protected readonly portraitSizes =
    '(min-width: 90rem) 553px, (min-width: 80rem) 41vw, (min-width: 48rem) 50vw, calc(100vw - 40px)';

  protected readonly career = computed(() =>
    (this.page()?.career ?? []).map((row) => ({ label: row.period, value: row.text })),
  );

  /** Every organisation, in content order, for the logo grid. */
  protected readonly names = computed(() =>
    (this.organisations() ?? []).map((entry) => entry.name),
  );

  /** The organisations whose content says what Sara did for them. */
  protected readonly collaborations = computed(() =>
    (this.organisations() ?? [])
      .filter((entry) => entry.role)
      .map((entry) => ({ name: entry.name, role: entry.role })),
  );
}
