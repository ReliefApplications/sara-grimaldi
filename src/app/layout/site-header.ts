import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { NAV_PAGES } from '../core/site-routes';
import { LanguageSwitcher } from './language-switcher';
import { MobileMenu } from './mobile-menu';

/**
 * Site header (design system, 8.2). On the home page it lies over the hero,
 * without background or wordmark: the name is the hero.
 */
@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, LanguageSwitcher, MobileMenu],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  host: { '[class.home]': 'home()' },
})
export class SiteHeader {
  protected readonly site = inject(ContentService).site;
  protected readonly route = inject(CurrentRouteService);
  protected readonly pages = NAV_PAGES;
  protected readonly home = computed(() => this.route.page() === 'home');

  private readonly menu = viewChild(MobileMenu);
  protected readonly menuOpen = signal(false);

  protected openMenu(): void {
    this.menu()?.open();
  }
}
