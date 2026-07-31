/**
 * Text conversion utilities for case conversion
 */

export function toUpperCaseText(text: string): string {
  return text.toUpperCase();
}

export function toLowerCaseText(text: string): string {
  return text.toLowerCase();
}

export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1) : ''))
    .join(' ');
}

export function toSentenceCase(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length === 0) return '';
  return trimmed[0].toUpperCase() + trimmed.slice(1).toLowerCase();
}

export function toCamelCase(text: string): string {
  return text
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((word, index) => {
      if (index === 0) return word;
      return word.length > 0 ? word[0].toUpperCase() + word.slice(1) : '';
    })
    .join('');
}

export function toSnakeCase(text: string): string {
  return text
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter((word) => word.length > 0)
    .join('_');
}

export function toKebabCase(text: string): string {
  return text
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter((word) => word.length > 0)
    .join('-');
}

export interface TextStats {
  characters: number;
  words: number;
  lines: number;
}

export function getTextStats(text: string): TextStats {
  const trimmed = text.trim();
  return {
    characters: text.length,
    words: trimmed ? trimmed.split(/\s+/).length : 0,
    lines: text.length === 0 ? 0 : text.split('\n').length,
  };
}

/**
 * Remove extra spaces between words (multiple spaces become single space)
 */
export function normalizeSpaces(text: string): string {
  return text.split('\n').map((line) => line.replace(/\s+/g, ' ').trim()).join('\n');
}

/**
 * Remove empty lines (lines with no content or only whitespace)
 */
export function removeEmptyLines(text: string): string {
  return text
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .join('\n');
}

/**
 * Trim whitespace from the beginning and end of each line
 */
export function trimLines(text: string): string {
  return text
    .split('\n')
    .map((line) => line.trim())
    .join('\n');
}

/**
 * Clean all: normalize spaces, remove empty lines, trim each line
 */
export function cleanText(text: string): string {
  // First, normalize spaces on each line
  let cleaned = normalizeSpaces(text);
  // Then remove empty lines
  cleaned = removeEmptyLines(cleaned);
  // Finally trim each line (normalizeSpaces already does this, but ensure consistency)
  cleaned = trimLines(cleaned);
  return cleaned.trim();
}

export interface SpaceCleaningStats {
  originalCharacters: number;
  cleanedCharacters: number;
  removedCharacters: number;
}
