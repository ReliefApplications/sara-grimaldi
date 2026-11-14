import { Injectable, signal } from '@angular/core';

/** One pause button stops every moving band; the choice lasts for the page view. */
@Injectable({ providedIn: 'root' })
export class BandState {
  readonly paused = signal(false);

  toggle(): void {
    this.paused.update((paused) => !paused);
  }
}
