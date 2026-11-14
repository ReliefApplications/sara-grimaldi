import { imageSources } from './content-image';

describe('imageSources', () => {
  const url = (path: string) => 'content/' + path;

  it('lists the standard widths of a still', () => {
    expect(imageSources({ src: 'images/immunity.webp' }, url)).toEqual({
      src: 'content/images/immunity-1600.webp',
      srcset:
        'content/images/immunity-480.webp 480w, content/images/immunity-768.webp 768w, ' +
        'content/images/immunity-1152.webp 1152w, content/images/immunity-1600.webp 1600w',
    });
  });

  it('uses the widths set on the image', () => {
    const sources = imageSources({ src: 'images/sara.webp', widths: [480, 768, 960] }, url);
    expect(sources.src).toBe('content/images/sara-960.webp');
    expect(sources.srcset).toContain('content/images/sara-768.webp 768w');
  });
});
