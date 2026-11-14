import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LEGAL_PAGE_IDS } from '../core/content-rules';
import { ContentService } from '../core/content.service';
import { CurrentRouteService } from '../core/current-route';

/** The only dark band of the site (8.5). */
@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  protected readonly site = inject(ContentService).site;
  protected readonly route = inject(CurrentRouteService);
  protected readonly year = new Date().getFullYear();
  protected readonly legalPages = LEGAL_PAGE_IDS;
}
