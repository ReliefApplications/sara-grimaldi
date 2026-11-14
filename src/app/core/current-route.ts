import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { DEFAULT_LANG, Lang, PageId } from './content.models';
import { pageLink, RouteInfo } from './site-routes';

interface CurrentRoute {
  lang: Lang;
  /** Undefined until the first navigation has finished. */
  page?: PageId;
  slug?: string;
  /** Path of the current page, without "#fragment", e.g. "/fr/films". */
  path: string;
}

/** The language, page and slug of the route currently displayed. */
@Injectable({ providedIn: 'root' })
export class CurrentRouteService {
  private readonly router = inject(Router);

  private readonly current = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.read()),
    ),
    { initialValue: this.read() },
  );

  readonly lang = computed<Lang>(() => this.current().lang);
  readonly page = computed(() => this.current().page);
  readonly slug = computed(() => this.current().slug);
  readonly path = computed(() => this.current().path);

  /** Router link to a page in the current language. */
  link(page: PageId, slug?: string): string[] {
    return pageLink(this.lang(), page, slug);
  }

  private read(): CurrentRoute {
    let route: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const info = route.data as Partial<RouteInfo>;
    return {
      lang: info.lang ?? DEFAULT_LANG,
      page: info.page,
      slug: route.paramMap.get('slug') ?? undefined,
      path: this.router.url.split(/[?#]/)[0],
    };
  }
}
