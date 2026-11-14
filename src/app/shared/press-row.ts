import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { PressItem, Resolved } from '../core/content.models';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { DotLine } from './dot-line';
import { InlineText } from './inline-text';
import { Logo } from './logo';

/** One press item in a list (design system, 8.10). */
@Component({
  selector: 'app-press-row',
  imports: [NgTemplateOutlet, InlineText, DotLine, Logo],
  templateUrl: './press-row.html',
  styleUrl: './press-row.scss',
})
export class PressRow {
  private readonly content = inject(ContentService);
  protected readonly site = this.content.site;
  private readonly lang = inject(CurrentRouteService).lang;

  readonly item = input.required<Resolved<PressItem>>();

  /** The article's language differs from the page's: its code joins the meta line. */
  private readonly otherCode = computed(() => {
    const code = this.item().articleLang;
    return code === this.lang() ? undefined : code;
  });

  /** Year, country and, when it differs from the page, the article's language code. */
  protected readonly meta = computed(() => [
    this.item().year,
    this.item().country,
    this.otherCode(),
  ]);

  /** Read after the code by screen readers: "article in French". */
  protected readonly otherLanguage = computed(() => {
    const code = this.otherCode();
    return code && this.site()?.articleLanguages[code];
  });

  protected readonly link = computed(() => {
    const item = this.item();
    return item.url ?? (item.scan ? this.content.assetUrl(item.scan.src) : undefined);
  });
}
