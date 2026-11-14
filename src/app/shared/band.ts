import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { BandState } from './band-state';

export interface BandItem {
  text: string;
  /** Narrow type instead of wide: the role labels of the `roles` band. */
  narrow?: boolean;
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
  imports: [RouterLink],
  templateUrl: './band.html',
  styleUrl: './band.scss',
  host: {
    '[class.reverse]': 'reverse()',
    '[class.paused]': 'state.paused()',
  },
})
export class Band {
  protected readonly site = inject(ContentService).site;
  protected readonly state = inject(BandState);

  readonly items = input.required<BandItem[]>();
  /** Moves left to right instead of right to left. */
  readonly reverse = input(false);
  /** Seconds for one loop. */
  readonly duration = input(36);
}
