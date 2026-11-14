import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Injector, Signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  BuildInfo,
  Collaboration,
  Film,
  InDevelopmentItem,
  PageId,
  Pages,
  PressItem,
  Resolved,
  SiteContent,
} from './content.models';
import { CurrentRouteService } from './current-route';
import { localize } from './localize';

/** Folder the /content files are served from, relative to the base href. */
const CONTENT_ROOT = 'content/';

/**
 * The single entry point to everything in /content. Each signal holds the
 * content in the current language, or `undefined` until its file has loaded.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly injector = inject(Injector);
  private readonly lang = inject(CurrentRouteService).lang;
  private readonly cache = new Map<string, Signal<unknown>>();

  /** content/site.json */
  readonly site = this.load<SiteContent>('site.json');

  /** Facts about this build, such as the public address of the site. */
  readonly build = this.load<BuildInfo>('build.json');

  /** content/pages/<id>.json */
  page<K extends PageId>(id: K): Signal<Resolved<Pages[K]> | undefined> {
    return this.load<Pages[K]>(`pages/${id}.json`);
  }

  /** Published entries of content/films, most recent first. */
  films(): Signal<Resolved<Film>[] | undefined> {
    return this.load<Film[]>('collections/films.json');
  }

  /** Entries of content/press, most recent first. */
  press(): Signal<Resolved<PressItem>[] | undefined> {
    return this.load<PressItem[]>('collections/press.json');
  }

  /** Entries of content/collaborations, in their set order. */
  collaborations(): Signal<Resolved<Collaboration>[] | undefined> {
    return this.load<Collaboration[]>('collections/collaborations.json');
  }

  /** Entries of content/in-development, in their set order. */
  inDevelopment(): Signal<Resolved<InDevelopmentItem>[] | undefined> {
    return this.load<InDevelopmentItem[]>('collections/in-development.json');
  }

  /** URL of a file referenced from content, e.g. "images/photo.webp". */
  assetUrl(path: string): string {
    return CONTENT_ROOT + path;
  }

  private load<T>(file: string): Signal<Resolved<T> | undefined> {
    let localized = this.cache.get(file) as Signal<Resolved<T> | undefined> | undefined;
    if (!localized) {
      // untracked: a file may be requested for the first time from inside an effect.
      const raw = untracked(() =>
        toSignal(this.http.get<T>(CONTENT_ROOT + file), { injector: this.injector }),
      );
      localized = computed(() => {
        const value = raw();
        return value === undefined ? undefined : localize(value, this.lang());
      });
      this.cache.set(file, localized);
    }
    return localized;
  }
}
