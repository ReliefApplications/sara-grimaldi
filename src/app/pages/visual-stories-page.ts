import { Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { PageHeading } from '../core/page-heading';
import { ArrowLink } from '../shared/arrow-link';
import { BlockButton } from '../shared/block-button';
import { ContentImage, IMAGE_SIZES } from '../shared/content-image';
import { DataList } from '../shared/data-list';
import { DotLine } from '../shared/dot-line';
import { InlineText } from '../shared/inline-text';
import { LogoGrid } from '../shared/logo-grid';

/**
 * Visual Stories: Sara's collective. Order from Sara's brief: hero, three
 * offers, selected work, trusted by, team, contact; one button repeated.
 */
@Component({
  selector: 'app-visual-stories-page',
  imports: [
    RouterLink,
    PageHeading,
    ArrowLink,
    BlockButton,
    ContentImage,
    DataList,
    DotLine,
    InlineText,
    LogoGrid,
  ],
  templateUrl: './visual-stories-page.html',
  styleUrl: './visual-stories-page.scss',
})
export class VisualStoriesPage {
  private readonly content = inject(ContentService);
  protected readonly route = inject(CurrentRouteService);
  protected readonly site = this.content.site;
  protected readonly page = this.content.page('visual-stories');

  protected readonly sizes = IMAGE_SIZES;
  /** Offers: one per row below md, three per row above. */
  protected readonly offerSizes = '(min-width: 48rem) 33vw, calc(100vw - 40px)';

  private readonly contact = viewChild<ElementRef<HTMLElement>>('contact');

  /** Each project with its three lines as label / value rows; a hidden line is left out. */
  protected readonly work = computed(() => {
    const page = this.page();
    if (!page) {
      return [];
    }
    const labels = page.workLabels;
    return page.work.map((project) => ({
      ...project,
      rows: [
        { label: labels.challenge, value: project.challenge },
        { label: labels.done, value: project.done },
        { label: labels.result, value: project.result },
      ].filter((row): row is { label: string; value: string } => !!row.value),
    }));
  });

  /**
   * "Work with us" leads to the contact block of this page: the router
   * scrolls to it; keyboard and screen reader users continue from there.
   */
  protected focusContact(): void {
    this.contact()?.nativeElement.focus({ preventScroll: true });
  }
}
