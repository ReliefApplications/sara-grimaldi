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

/** Visual Stories: Sara's collective of women directors and photographers. */
@Component({
  selector: 'app-visual-stories-page',
  imports: [RouterLink, PageHeading, BlockButton, ContentImage, DataList, DotLine, InlineText],
  templateUrl: './visual-stories-page.html',
  styleUrl: './visual-stories-page.scss',
})
export class VisualStoriesPage {
  protected readonly route = inject(CurrentRouteService);
  protected readonly page = inject(ContentService).page('visual-stories');

  /** Lead image: full width below md, 4 of 8 columns at md, 5 of 12 at lg. */
  protected readonly imageSizes =
    '(min-width: 90rem) 553px, (min-width: 80rem) 41vw, (min-width: 48rem) 50vw, calc(100vw - 40px)';
  /** Gallery: one per row below md, three per row above. */
  protected readonly gallerySizes = '(min-width: 48rem) 33vw, calc(100vw - 40px)';

  protected readonly caseRows = computed(() =>
    (this.page()?.case.rows ?? []).map((row) => ({ label: row.label, value: row.text })),
  );

  protected readonly method = computed(() =>
    (this.page()?.method ?? []).map((step, index) => ({
      label: `${String(index + 1).padStart(2, '0')} ${step.label}`,
      value: step.text,
    })),
  );
}
