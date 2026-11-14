import {
  afterNextRender,
  Component,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';

/** Where the visitor's choice to hide the notice is remembered (design system, 8.26). */
const STORAGE_KEY = 'sg-privacy-notice';

/**
 * The "cookie banner": an information notice, not a consent request. Shown
 * only in the browser, once the stored choice has been read, so it is never
 * part of the prerendered pages and never flashes for returning visitors.
 */
@Component({
  selector: 'app-privacy-notice',
  imports: [RouterLink],
  template: `
    @if (visible() && site()?.privacyNotice; as notice) {
      <aside #panel class="notice surface-ground t-small" [attr.aria-label]="notice.regionLabel">
        <p>{{ notice.text }}</p>
        <div class="actions">
          <a class="text-link" [routerLink]="route.link('privacy')">{{ notice.linkLabel }}</a>
          <button class="dismiss t-nav" type="button" (click)="dismiss(notice.version)">
            {{ notice.dismissLabel }}
          </button>
        </div>
      </aside>
    }
  `,
  styleUrl: './privacy-notice.scss',
})
export class PrivacyNotice {
  protected readonly site = inject(ContentService).site;
  protected readonly route = inject(CurrentRouteService);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  /** Undefined until the browser has read the stored choice (null: none stored). */
  private readonly stored = signal<string | null | undefined>(undefined);
  /** Used when the browser refuses storage: the choice lasts for this visit only. */
  private readonly dismissedThisVisit = signal(false);

  protected readonly visible = () => {
    const notice = this.site()?.privacyNotice;
    return (
      !!notice?.enabled &&
      this.stored() !== undefined &&
      this.stored() !== notice.version &&
      !this.dismissedThisVisit()
    );
  };

  constructor() {
    // Browser only; nothing is read when the notice is switched off.
    afterNextRender(() => {
      effect(
        () => {
          if (this.site()?.privacyNotice.enabled && this.stored() === undefined) {
            this.stored.set(this.read());
          }
        },
        { injector: this.injector },
      );
    });

    // While visible, keep its height available to the page so that nothing
    // focused or at the end of the footer stays hidden behind it.
    effect((onCleanup) => {
      const panel = this.panel()?.nativeElement;
      const root = this.document.documentElement;
      if (!panel || typeof ResizeObserver === 'undefined') {
        return;
      }
      const observer = new ResizeObserver(() =>
        root.style.setProperty('--notice-space', `${panel.offsetHeight + 24}px`),
      );
      observer.observe(panel);
      onCleanup(() => {
        observer.disconnect();
        root.style.removeProperty('--notice-space');
      });
    });
  }

  protected dismiss(version: string): void {
    const hadFocus = this.panel()?.nativeElement.contains(this.document.activeElement);
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, version);
      this.stored.set(version);
    } catch {
      this.dismissedThisVisit.set(true);
    }
    if (hadFocus) {
      this.document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
    }
  }

  private read(): string | null {
    try {
      return this.document.defaultView?.localStorage.getItem(STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }
}
