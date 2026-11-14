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
        <ul class="t-nav">
          @for (language of site.languages; track language.code) {
            <li>
              @if (language.code === route.lang()) {
                <span class="item current" aria-current="true"
                  >{{ language.short
                  }}<span class="visually-hidden"> – {{ site.ui.currentLanguage }}</span></span
                >
              } @else {
                <a
                  class="item"
                  [routerLink]="link(language.code)"
                  [attr.lang]="language.code"
                  [attr.hreflang]="language.code"
                  ><span class="code">{{ language.short }}</span
                  ><span class="visually-hidden"> – {{ language.name }}</span></a
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
      color: var(--text);
      white-space: nowrap;
    }

    li {
      display: flex;
      align-items: center;
    }

    li + li::before {
      content: '/';
    }

    .item {
      display: inline-flex;
      align-items: center;
      min-width: var(--space-6);
      min-height: var(--target-size);
      justify-content: center;
    }

    .current {
      font-weight: 800;
    }

    a.item {
      font-weight: 400;

      &:hover .code {
        padding: 0 0.12em;
        background: var(--highlight-bg);
        color: var(--highlight-text);
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
