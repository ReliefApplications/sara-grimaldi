import { localize } from './localize';

describe('localize', () => {
  const content = {
    name: 'Sara Grimaldi',
    role: { fr: 'Réalisatrice', en: 'Film director' },
    body: { fr: ['Un', 'Deux'], en: [] as string[] },
    items: [{ label: { fr: 'Année', en: 'Year' }, year: 2024 }],
  };

  it('picks the requested language at any depth and keeps other values', () => {
    expect(localize(content, 'en')).toEqual({
      name: 'Sara Grimaldi',
      role: 'Film director',
      body: ['Un', 'Deux'],
      items: [{ label: 'Year', year: 2024 }],
    });
  });

  it('falls back to French when a translation is empty', () => {
    expect(localize({ title: { fr: 'Presse', en: '' } }, 'en').title).toBe('Presse');
  });
});
