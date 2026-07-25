import { RawContactInput } from './types';

export type TextFormatMode = 'auto' | 'numbers_only' | 'number_name';

export function parseTextContent(
  text: string,
  mode: TextFormatMode = 'auto'
): RawContactInput[] {
  if (!text || text.trim() === '') {
    return [];
  }

  const lines = text.split(/\r?\n/);
  const results: RawContactInput[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return; // Skip empty lines

    let phone = '';
    let name = '';

    if (mode === 'numbers_only') {
      phone = trimmed;
      name = '';
    } else {
      // Auto detect delimiters: comma, hyphen, tab, multiple spaces
      // Check if comma exists
      if (trimmed.includes(',')) {
        const parts = trimmed.split(',');
        phone = parts[0].trim();
        name = parts.slice(1).join(',').trim();
      } else if (trimmed.includes(' - ')) {
        const parts = trimmed.split(' - ');
        phone = parts[0].trim();
        name = parts.slice(1).join(' - ').trim();
      } else if (trimmed.includes('\t')) {
        const parts = trimmed.split('\t');
        phone = parts[0].trim();
        name = parts.slice(1).join(' ').trim();
      } else if (/\s{2,}/.test(trimmed)) {
        // Multiple spaces delimiter
        const parts = trimmed.split(/\s{2,}/);
        phone = parts[0].trim();
        name = parts.slice(1).join(' ').trim();
      } else {
        // Single word or space-separated digits vs name
        // e.g. "+91 98765 43210 Rahul Kumar"
        // Try to see if line starts with phone digits or +
        const phoneMatch = trimmed.match(/^(\+?[\d\s\-()]{7,15})(.*)$/);
        if (phoneMatch && phoneMatch[2] && phoneMatch[2].trim().length > 0) {
          phone = phoneMatch[1].trim();
          name = phoneMatch[2].trim();
        } else {
          phone = trimmed;
          name = '';
        }
      }

      // Swap if phone was accidentally placed in name column (e.g. "Rahul Kumar, 9876543210")
      if (isLikelyPhone(name) && !isLikelyPhone(phone)) {
        const temp = phone;
        phone = name;
        name = temp;
      }
    }

    results.push({
      originalRowIndex: index + 1,
      originalPhone: sanitizeFormula(phone),
      originalName: sanitizeFormula(name),
      source: 'paste',
    });
  });

  return results;
}

function isLikelyPhone(str: string): boolean {
  if (!str) return false;
  const digitsOnly = str.replace(/\D/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

function sanitizeFormula(value: string): string {
  if (!value) return '';
  if (/^[=+\-@]/.test(value.trim())) {
    return `'${value.trim()}`;
  }
  return value.trim();
}
