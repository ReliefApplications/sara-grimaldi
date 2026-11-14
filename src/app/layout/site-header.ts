import { Component, inject, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';
import { NAV_PAGES } from '../core/site-routes';
import { LanguageSwitcher } from './language-switcher';
import { MobileMenu } from './mobile-menu';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, LanguageSwitcher, MobileMenu],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  protected readonly site = inject(ContentService).site;
  protected readonly route = inject(CurrentRouteService);
  protected readonly pages = NAV_PAGES;

  private readonly menu = viewChild(MobileMenu);
  protected readonly menuOpen = signal(false);

  protected openMenu(): void {
    this.menu()?.open();
  }
}
