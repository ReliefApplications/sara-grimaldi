import { Component, DOCUMENT, ElementRef, inject, output, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { NAV_PAGES } from '../core/site-routes';
import { LanguageSwitcher } from './language-switcher';

/**
 * Full-screen menu below the lg breakpoint (8.4). A native modal <dialog>:
 * the browser traps focus inside it, closes it on Esc and returns focus to
 * the Menu button.
 */
@Component({
  selector: 'app-mobile-menu',
  imports: [RouterLink, RouterLinkActive, LanguageSwitcher],
  templateUrl: './mobile-menu.html',
  styleUrl: './mobile-menu.scss',
  host: { '(window:resize)': 'closeOnDesktop()' },
})
export class MobileMenu {
  protected readonly site = inject(ContentService).site;
  protected readonly route = inject(CurrentRouteService);
  protected readonly pages = NAV_PAGES;

  private readonly document = inject(DOCUMENT);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  readonly openChange = output<boolean>();

  constructor() {
    // Choosing a link (or the other language) closes the panel.
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.close());
  }

  open(): void {
    this.dialog()?.nativeElement.showModal();
    this.setOpen(true);
  }

  protected close(): void {
    const dialog = this.dialog()?.nativeElement;
    if (dialog?.open) {
      dialog.close();
    }
  }

  /** Also called by the browser's own close (Esc). */
  protected onClose(): void {
    this.setOpen(false);
  }

  protected closeOnDesktop(): void {
    if (
      this.dialog()?.nativeElement.open &&
      this.document.defaultView?.matchMedia('(min-width: 80rem)').matches
    ) {
      this.close();
    }
  }

  private setOpen(open: boolean): void {
    this.document.documentElement.classList.toggle('menu-open', open);
    this.openChange.emit(open);
  }
}
