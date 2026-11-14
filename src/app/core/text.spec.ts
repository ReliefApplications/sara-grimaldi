import { dotJoin, splitInline } from './text';

describe('dotJoin', () => {
  it('skips empty items and keeps the dot with the preceding word', () => {
    expect(dotJoin([2024, undefined, '9 min', ''])).toBe('2024\u00A0· 9 min');
  });
});

describe('splitInline', () => {
  it('marks phrases between asterisks as titles', () => {
    expect(splitInline('Article sur *Immunity* et *Il bosco incantato*.')).toEqual([
      { text: 'Article sur ', kind: 'text' },
      { text: 'Immunity', kind: 'title' },
      { text: ' et ', kind: 'text' },
      { text: 'Il bosco incantato', kind: 'title' },
      { text: '.', kind: 'text' },
    ]);
  });

  it('prints an unpaired asterisk as is', () => {
    expect(splitInline('5 * 3 = 15')).toEqual([{ text: '5 * 3 = 15', kind: 'text' }]);
    expect(splitInline('Plain text')).toEqual([{ text: 'Plain text', kind: 'text' }]);
  });

  it('marks facts still to be completed, in both languages', () => {
    expect(splitInline('Adresse\u00A0: [à compléter\u00A0: adresse professionnelle].')).toEqual([
      { text: 'Adresse\u00A0: ', kind: 'text' },
      { text: '[à compléter\u00A0: adresse professionnelle]', kind: 'placeholder' },
      { text: '.', kind: 'text' },
    ]);
    expect(splitInline('[to be completed: full name]')[0].kind).toBe('placeholder');
    expect(splitInline('[see below]')[0].kind).toBe('text');
  });
});
