import { Component, computed, inject, input } from '@angular/core';
import { ContentService } from '../core/content.service';
import { splitInline } from '../core/text';

/**
 * A text from /content in which `*Title*` is shown as a film or work title
 * and `[à compléter : …]` as a highlighted placeholder (design system, 3.2).
 * Builds elements and text; never injects HTML.
 *
 * A title gets the language of the work it names (design system, 10), found
 * among the films and the projects in development. A title that is neither
 * keeps the language of the page: no `lang` is better than a wrong one.
 */
@Component({
  selector: 'app-inline-text',
  // Kept on one line: whitespace between the parts would show up as extra spaces.
  // prettier-ignore
  template: `@for (part of parts(); track $index) {@switch (part.kind) {@case ('title') {<cite class="t-film-title" [attr.lang]="part.lang">{{ part.text }}</cite>} @case ('placeholder') {<mark class="t-placeholder">{{ part.text }}</mark>} @default {{{ part.text }}}}}`,
  styles: `
    :host {
      display: inline;
    }
  `,
})
export class InlineText {
  private readonly content = inject(ContentService);
  private readonly films = this.content.films();
  private readonly inDevelopment = this.content.inDevelopment();

  readonly text = input.required<string>();

  private readonly languages = computed(
    () =>
      new Map(
        [...(this.films() ?? []), ...(this.inDevelopment() ?? [])].map((work) => [
          work.title,
          work.titleLang,
        ]),
      ),
  );

  protected readonly parts = computed(() =>
    splitInline(this.text()).map((part) => ({
      ...part,
      lang: part.kind === 'title' ? (this.languages().get(part.text) ?? null) : null,
    })),
  );
}
