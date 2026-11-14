import { Component, computed, inject, input } from '@angular/core';
import { ContentService } from '../core/content.service';

/**
 * A client or a medium, shown as its logo when content has one for that name
 * and as its name in text otherwise, so a missing logo never leaves a gap.
 */
@Component({
  selector: 'app-organisation-mark',
  template: `
    @if (logo(); as logo) {
      <img
        [src]="content.assetUrl(logo.src)"
        [alt]="logo.alt"
        [attr.width]="logo.size?.[0]"
        [attr.height]="logo.size?.[1]"
        loading="lazy"
        decoding="async"
      />
    } @else {
      <span class="name">{{ name() }}</span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
    }

    img {
      width: auto;
      height: 100%;
    }
  `,
})
export class OrganisationMark {
  protected readonly content = inject(ContentService);

  /** Name as written in a collaboration or a press item. */
  readonly name = input.required<string>();

  protected readonly logo = computed(
    () => this.content.organisationByName().get(this.name().toLowerCase())?.logo,
  );
}
