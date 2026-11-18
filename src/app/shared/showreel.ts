import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface ShowreelVideo {
  provider: 'vimeo' | 'youtube';
  id: string;
  title: string;
  closeLabel: string;
}

/**
 * Sara's showreel over the home hero (design system 7.5).
 * - "ambient": muted, looping, no controls, behind the name; fades in once
 *   loaded so the photo shows until the video really plays.
 * - "full": the provider's player with sound and controls, covering the hero,
 *   with a close button, which receives focus when the player opens (the page
 *   gives focus back to its own button when it closes).
 * The host covers its positioned parent; the page decides when to add it.
 */
@Component({
  selector: 'app-showreel',
  host: { '[class.ambient]': "mode() === 'ambient'", '[class.ready]': 'ready()' },
  template: `
    @if (url(); as url) {
      <iframe
        [src]="url"
        [title]="video().title"
        [attr.tabindex]="mode() === 'ambient' ? -1 : null"
        [attr.aria-hidden]="mode() === 'ambient' ? 'true' : null"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        (load)="ready.set(true)"
      ></iframe>
    }
    @if (mode() === 'full') {
      <button #close class="close t-nav" type="button" (click)="closed.emit()">
        {{ video().closeLabel }}
      </button>
    }
  `,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      z-index: 2;
      overflow: hidden;
      background: #000;
    }

    iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }

    // Ambient: under the scrim and the name, cropped to fill like the photo
    // (a 16:9 frame at least as wide and as tall as the hero).
    :host(.ambient) {
      z-index: auto;
      container-type: size;
      background: none;
      opacity: 0;
      pointer-events: none;
      transition: opacity 1.2s ease 0.8s;

      iframe {
        position: absolute;
        top: 50%;
        left: 50%;
        width: max(100cqw, 177.78cqh);
        height: max(100cqh, 56.25cqw);
        transform: translate(-50%, -50%);
      }
    }

    :host(.ambient.ready) {
      opacity: 1;
    }

    .close {
      position: absolute;
      right: var(--margin);
      bottom: var(--space-4);
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--color-ground);
      background: rgb(0 0 0 / 60%);
      color: var(--color-ground);
      cursor: pointer;

      // At least 44 px high to touch (6.6) without changing how it looks.
      &::before {
        content: '';
        position: absolute;
        inset: min(0px, (100% - var(--target-size)) / 2) 0;
      }
    }
  `,
})
export class Showreel {
  private readonly sanitizer = inject(DomSanitizer);

  readonly video = input.required<ShowreelVideo>();
  readonly mode = input<'ambient' | 'full'>('full');
  readonly closed = output<void>();

  protected readonly ready = signal(false);
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('close');

  constructor() {
    afterNextRender(() => {
      if (this.mode() === 'full') {
        this.closeButton()?.nativeElement.focus();
      }
    });
  }

  /** Player address, built only from a validated id. */
  protected readonly url = computed<SafeResourceUrl | null>(() => {
    const { provider, id } = this.video();
    const ambient = this.mode() === 'ambient';
    let url: string | null = null;
    if (provider === 'vimeo' && /^\d+$/.test(id)) {
      url = `https://player.vimeo.com/video/${id}?dnt=1&${ambient ? 'background=1' : 'autoplay=1'}`;
    } else if (provider === 'youtube' && /^[\w-]{11}$/.test(id)) {
      url = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1${
        ambient ? `&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1` : ''
      }`;
    }
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });
}
