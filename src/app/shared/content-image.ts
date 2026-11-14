import { Component, computed, inject, input } from '@angular/core';
import { IMAGE_WIDTHS, ImageRef, Resolved } from '../core/content.models';
import { ContentService } from '../core/content.service';

/** The `sizes` of each image slot (design system, 7.4 and the page layouts). */
export const IMAGE_SIZES = {
  /** Edge to edge: the hero and a film page's lead image. */
  bleed: '100vw',
  /** Full container width. */
  full: '(min-width: 90rem) 1360px, (min-width: 80rem) calc(100vw - 80px), (min-width: 48rem) calc(100vw - 64px), calc(100vw - 40px)',
  /** Half the container from md, full width below. */
  half: '(min-width: 90rem) 668px, (min-width: 80rem) calc(50vw - 52px), (min-width: 48rem) calc(50vw - 44px), calc(100vw - 40px)',
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
 * An image from /content with its responsive sources, filling whatever box
 * its parent gives it (design system, 7). "cover" images are cropped around
 * their focus point; "poster" images are shown whole on an ink field.
 * Lazy by default; `priority` is for the hero and a film page's lead image.
 */
@Component({
  selector: 'app-content-image',
  host: { '[class.poster]': "image().fit === 'poster'" },
  template: `
    <img
      [src]="sources().src"
      [attr.srcset]="sources().srcset"
      [attr.sizes]="sizes()"
      [alt]="image().alt"
      [width]="image().width"
      [height]="image().height"
      [style.object-position]="image().focus ?? null"
      [attr.loading]="priority() ? 'eager' : 'lazy'"
      [attr.fetchpriority]="priority() ? 'high' : null"
      decoding="async"
    />
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: var(--color-placeholder);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    :host(.poster) {
      display: grid;
      place-items: center;
      background: var(--color-ink);

      img {
        width: auto;
        max-width: 84%;
        height: 84%;
        object-fit: contain;
      }
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
