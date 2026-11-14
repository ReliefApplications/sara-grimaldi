import { pageLink } from './site-routes';

describe('pageLink', () => {
  it('builds language-specific links', () => {
    expect(pageLink('fr', 'home')).toEqual(['/', 'fr']);
    expect(pageLink('fr', 'about')).toEqual(['/', 'fr', 'a-propos']);
    expect(pageLink('en', 'press')).toEqual(['/', 'en', 'press']);
    expect(pageLink('en', 'films', 'immunity')).toEqual(['/', 'en', 'films', 'immunity']);
    expect(pageLink('en', 'not-found')).toEqual(['/', 'en']);
  });
});
