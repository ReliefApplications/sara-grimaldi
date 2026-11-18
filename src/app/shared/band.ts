import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { BandState } from './band-state';
import { Logo } from './logo';

export interface BandItem {
  text: string;
  /** Narrow type instead of wide: the role labels of the `roles` band. */
  narrow?: boolean;
  /** Shown as the organisation's logo when it has one (press band). */
  logo?: boolean;
  /** Router link and fragment, for items that navigate. */
  link?: string[];
  fragment?: string;
}

/**
 * A full-width strip of large uppercase words that scrolls sideways (design
 * system, 8.5). It pauses under the pointer, while focus is inside it and
 * with its button; under reduced motion it is a static, wrapping strip.
 */
@Component({
  selector: 'app-band',
  imports: [RouterLink, Logo],
  templateUrl: './band.html',
  styleUrl: './band.scss',
  host: {
    '[class.reverse]': 'reverse()',
    '[class.logos]': 'logos()',
    '[class.paused]': 'state.paused()',
  },
})
export class Band {
  protected readonly site = inject(ContentService).site;
  protected readonly state = inject(BandState);

  readonly items = input.required<BandItem[]>();
  /** Moves left to right instead of right to left. */
  readonly reverse = input(false);
  /** Wider gaps around the dots, for a band of logos. */
  readonly logos = input(false);
  /** Seconds for one loop. */
  readonly duration = input(36);

  /** Focus left the strip: back to the start, so the loop shows no gap when it resumes. */
  protected resetScroll(event: FocusEvent): void {
    const viewport = event.currentTarget as HTMLElement;
    if (!viewport.contains(event.relatedTarget as Node | null)) {
      viewport.scrollLeft = 0;
    }
  }
}
