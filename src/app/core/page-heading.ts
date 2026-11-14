import { Directive, effect, ElementRef, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/** Counts the navigations after which focus must move to the page heading. */
@Injectable({ providedIn: 'root' })
export class HeadingFocusService {
  readonly requested = signal(0);
  handled = 0;

  constructor() {
    let previous: string | undefined;
    inject(Router)
      .events.pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        // Not on the first page load, and not when only the "#anchor" changes.
        const path = event.urlAfterRedirects.split(/[?#]/)[0];
        if (previous !== undefined && path !== previous) {
          this.requested.update((count) => count + 1);
        }
        previous = path;
      });
  }
}

/**
 * Put on the `h1` of every page: after a navigation, keyboard and screen
 * reader users continue from the new page's heading (design system, 10).
 */
@Directive({
  selector: 'h1[appPageHeading]',
  host: { tabindex: '-1' },
})
export class PageHeading {
  constructor() {
    const focus = inject(HeadingFocusService);
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    effect(() => {
      const requested = focus.requested();
      if (requested > focus.handled) {
        focus.handled = requested;
        element.focus({ preventScroll: true });
      }
    });
  }
}
