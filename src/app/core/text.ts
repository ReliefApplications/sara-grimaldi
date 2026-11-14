import { PLACEHOLDER_PATTERN } from './content-rules';

/**
 * Joins the items of a metadata line with " · ". The space before the dot is
 * non-breaking, so a line never starts with the separator (design system, 9.1).
 */
export function dotJoin(parts: (string | number | undefined | null)[]): string {
  return parts
    .filter((part) => part !== undefined && part !== null && part !== '')
    .join('\u00A0· ');
}

export interface TextPart {
  text: string;
  /**
   * "title": a film or work title, written `*like this*` in content.
   * "placeholder": a fact still to be supplied, written `[à compléter : …]`.
   */
  kind: 'text' | 'title' | 'placeholder';
}

const MARKS = new RegExp(`(\\*[^*]+\\*|${PLACEHOLDER_PATTERN.source})`);

/**
 * Splits a text on the two inline conventions of the content files (design
 * system, 3.2). No nesting; an unpaired asterisk stays as is.
 */
export function splitInline(text: string): TextPart[] {
  return text
    .split(MARKS)
    .filter((part) => part !== '')
    .map((part): TextPart => {
      if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
        return { text: part.slice(1, -1), kind: 'title' };
      }
      return { text: part, kind: PLACEHOLDER_PATTERN.test(part) ? 'placeholder' : 'text' };
    });
}
