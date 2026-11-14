import { Component, computed, inject, input } from '@angular/core';
import { ContentService } from '../core/content.service';

/**
 * An organisation shown as its logo, fitted in a box so that wide wordmarks
 * and tall emblems carry similar weight, or as its name in type when content
 * has no logo for it (design system, 8.15). `size` picks the box: "grid"
 * (logo grid, in colour, blended into the ground), "band" (press band) or
 * "row" (press rows). Logos never go on the ink surface.
 */
@Component({
  selector: 'app-logo',
  host: { '[class]': 'size()' },
  template: `
    @if (logo(); as logo) {
      <img
        [src]="content.assetUrl(logo.src)"
        [alt]="decorative() ? '' : label()"
        [attr.width]="logo.size[0]"
        [attr.height]="logo.size[1]"
        [style.--logo-scale]="logo.scale ?? 1"
        [style.--logo-w.px]="logo.size[0]"
        [style.--logo-h.px]="logo.size[1]"
        loading="lazy"
        decoding="async"
      />
    } @else {
      <span class="name">{{ name() }}</span>
    }
  `,
  styleUrl: './logo.scss',
})
export class Logo {
  protected readonly content = inject(ContentService);

  /** Name of the organisation, as written in content (or one of its aliases). */
  readonly name = input.required<string>();
  readonly size = input.required<'grid' | 'band' | 'row'>();
  /** In the hidden second copy of a band the image says nothing. */
  readonly decorative = input(false);

  private readonly organisation = computed(() =>
    this.content.organisationByName().get(this.name().toLowerCase()),
  );
  protected readonly logo = computed(() => this.organisation()?.logo);
  /** The description of the logo is the organisation's name, nothing more. */
  protected readonly label = computed(() => this.organisation()?.name ?? this.name());
}
