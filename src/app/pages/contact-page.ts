import { Component, inject } from '@angular/core';
import { ContentService } from '../core/content.service';
import { PageHeading } from '../core/page-heading';

/** Contact (design system, 10.5). The only page that shows the phone number. */
@Component({
  selector: 'app-contact-page',
  imports: [PageHeading],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss',
})
export class ContactPage {
  private readonly content = inject(ContentService);

  protected readonly site = this.content.site;
  protected readonly page = this.content.page('contact');
}
