import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Lang, LANGS } from './content.models';

export interface PageMeta {
  lang: Lang;
  siteName: string;
  title: string;
  description: string;
  type: 'website' | 'video.movie';
  /** Sharing image, if there is one: absolute URL and its description. */
  image?: { url: string; alt: string };
  /** Absolute URL of this page in each language; omitted for the not-found page. */
  urls?: Record<Lang, string>;
  /** Instruction to search engines, e.g. "noindex"; none when the page may be listed. */
  robots?: string;
}

const OG_LOCALE: Record<Lang, string> = { fr: 'fr_FR', en: 'en_GB' };

/** Sets the document language, title, description, sharing tags and canonical links. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(page: PageMeta): void {
    this.document.documentElement.lang = page.lang;
    this.title.setTitle(page.title);
    this.tag('name', 'description', page.description);
    this.tag('name', 'robots', page.robots);
    this.tag('property', 'og:title', page.title);
    this.tag('property', 'og:description', page.description);
    this.tag('property', 'og:type', page.type);
    this.tag('property', 'og:site_name', page.siteName);
    this.tag('property', 'og:locale', OG_LOCALE[page.lang]);
    this.tag('property', 'og:url', page.urls?.[page.lang]);
    this.tag('property', 'og:image', page.image?.url);
    this.tag('property', 'og:image:alt', page.image?.alt);
    this.tag('name', 'twitter:card', page.image ? 'summary_large_image' : 'summary');

    this.link('canonical', undefined, page.urls?.[page.lang]);
    for (const lang of LANGS) {
      this.link('alternate', lang, page.urls?.[lang]);
    }
    this.link('alternate', 'x-default', page.urls?.fr);
  }

  private tag(attribute: 'name' | 'property', key: string, content: string | undefined): void {
    if (content) {
      this.meta.updateTag({ [attribute]: key, content });
    } else {
      this.meta.removeTag(`${attribute}="${key}"`);
    }
  }

  private link(rel: string, hreflang: string | undefined, href: string | undefined): void {
    const head = this.document.head;
    const selector = `link[rel="${rel}"]` + (hreflang ? `[hreflang="${hreflang}"]` : '');
    let element = head.querySelector<HTMLLinkElement>(selector);
    if (!href) {
      element?.remove();
      return;
    }
    if (!element) {
      element = this.document.createElement('link');
      element.setAttribute('rel', rel);
      if (hreflang) {
        element.setAttribute('hreflang', hreflang);
      }
      head.appendChild(element);
    }
    element.setAttribute('href', href);
  }
}
