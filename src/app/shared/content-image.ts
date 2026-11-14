import { Component, computed, inject, input } from '@angular/core';
import { IMAGE_WIDTHS, ImageRef, Resolved } from '../core/content.models';
import { ContentService } from '../core/content.service';

/** The `sizes` of each image slot (design system, 7.2). */
export const IMAGE_SIZES = {
  full: '(min-width: 80rem) 1152px, calc(100vw - 40px)',
  feature: '(min-width: 80rem) 659px, (min-width: 48rem) calc(100vw - 80px), calc(100vw - 40px)',
  card: '(min-width: 80rem) 560px, (min-width: 48rem) calc(50vw - 52px), calc(100vw - 40px)',
} as const;

/** Files of an image set: "images/a.webp" → "images/a-480.webp 480w, …". */
export function imageSources(
  image: Pick<ImageRef, 'src' | 'widths'>,
  url: (path: string) => string,
): { src: string; srcset: string } {
  const widths = image.widths ?? IMAGE_WIDTHS;
  const file = (width: number) => url(image.src.replace(/(\.\w+)$/, `-${width}$1`));
  return {
    src: file(Math.max(...widths)),
    srcset: widths.map((width) => `${file(width)} ${width}w`).join(', '),
  };
}

/**
 * An image from /content with its responsive sources (design system, 7.2).
 * Lazy by default; `priority` is for the lead image of a film page.
 */
@Component({
  selector: 'app-content-image',
  template: `
    <img
      [src]="sources().src"
      [attr.srcset]="sources().srcset"
      [attr.sizes]="sizes()"
      [alt]="image().alt"
      [width]="image().width"
      [height]="image().height"
      [attr.loading]="priority() ? 'eager' : 'lazy'"
      [attr.fetchpriority]="priority() ? 'high' : null"
      decoding="async"
    />
  `,
  styles: `
    :host {
      display: block;
      background: var(--color-surface);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `,
})
export class ContentImage {
  private readonly content = inject(ContentService);

  readonly image = input.required<Resolved<ImageRef>>();
  readonly sizes = input.required<string>();
  readonly priority = input(false);

  protected readonly sources = computed(() =>
    imageSources(this.image(), (path) => this.content.assetUrl(path)),
  );
}
