import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lang } from '../core/content.models';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { pageLink } from '../core/site-routes';

/** "FR / EN": the current language as text, the other as a link to the same page (8.3). */
@Component({
  selector: 'app-language-switcher',
  imports: [RouterLink],
  template: `
    @if (site(); as site) {
      <nav [attr.aria-label]="site.ui.languageNavLabel">
        <ul class="t-label">
          @for (language of site.languages; track language.code) {
            <li>
              @if (language.code === route.lang()) {
                <span class="item" aria-current="true"
                  >{{ language.short
                  }}<span class="visually-hidden"> – {{ site.ui.currentLanguage }}</span></span
                >
              } @else {
                <a
                  class="item"
                  [routerLink]="link(language.code)"
                  [attr.lang]="language.code"
                  [attr.hreflang]="language.code"
                  >{{ language.short
                  }}<span class="visually-hidden"> – {{ language.name }}</span></a
                >
              }
            </li>
          }
        </ul>
      </nav>
    }
  `,
  styles: `
    ul {
      display: flex;
      align-items: center;
    }

    li + li::before {
      content: '/';
      color: var(--color-muted);
    }

    .item {
      display: inline-flex;
      align-items: center;
      min-height: var(--target-size);
      padding-inline: var(--space-2);
    }

    a.item {
      color: var(--color-muted);

      &:hover {
        color: var(--color-accent);
        text-decoration: underline 1px;
        text-underline-offset: 6px;
      }
    }
  `,
})
export class LanguageSwitcher {
  protected readonly site = inject(ContentService).site;
  protected readonly route = inject(CurrentRouteService);

  protected link(lang: Lang): string[] {
    return pageLink(lang, this.route.page() ?? 'home', this.route.slug());
  }
}
