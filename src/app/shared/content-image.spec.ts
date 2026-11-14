import { imageSources } from './content-image';

describe('imageSources', () => {
  const url = (path: string) => 'content/' + path;

  it('lists the standard widths of a tile image', () => {
    expect(imageSources({ src: 'images/films/immunity.webp' }, url)).toEqual({
      src: 'content/images/films/immunity-1152.webp',
      srcset:
        'content/images/films/immunity-480.webp 480w, content/images/films/immunity-768.webp 768w, ' +
        'content/images/films/immunity-1152.webp 1152w',
    });
  });

  it('uses the widths set on the image', () => {
    const sources = imageSources({ src: 'images/hero.webp', widths: [480, 768, 1280, 1920] }, url);
    expect(sources.src).toBe('content/images/hero-1920.webp');
    expect(sources.srcset).toContain('content/images/hero-1280.webp 1280w');
  });
});
