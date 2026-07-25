import Papa from 'papaparse';
import { RawContactInput } from './types';

const PHONE_HEADER_PATTERNS = [
  'phone',
  'phone number',
  'phonenumber',
  'mobile',
  'mobile number',
  'mobilenumber',
  'number',
  'contact',
  'phone_number',
  'mobile_number',
  'contact_number',
];

const NAME_HEADER_PATTERNS = [
  'name',
  'full name',
  'fullname',
  'contact name',
  'contactname',
  'full_name',
  'contact_name',
  'person',
  'display name',
];

export interface ParseCsvResult {
  contacts: RawContactInput[];
  errors: string[];
  totalRows: number;
}

export function parseCsvContent(fileContent: string): ParseCsvResult {
  const errors: string[] = [];
  const contacts: RawContactInput[] = [];

  // Parse CSV string using PapaParse
  const parsed = Papa.parse<string[]>(fileContent, {
    skipEmptyLines: 'greedy',
    trimHeaders: true,
  });

  if (parsed.errors && parsed.errors.length > 0) {
    parsed.errors.forEach((err) => {
      if (err.type !== 'Delimiter') {
        errors.push(`Row ${err.row !== undefined ? err.row + 1 : ''}: ${err.message}`);
      }
    });
  }

  const rows = parsed.data as string[][];

  if (!rows || rows.length === 0) {
    return { contacts: [], errors: ['CSV file is empty.'], totalRows: 0 };
  }

  let phoneColIndex = 0;
  let nameColIndex = 1;
  let hasHeader = false;

  // Inspect first row to determine if headers are present
  const firstRow = rows[0].map((cell) => cell ? cell.trim().toLowerCase() : '');

  const phoneMatchIndex = firstRow.findIndex((cell) =>
    PHONE_HEADER_PATTERNS.includes(cell)
  );
  const nameMatchIndex = firstRow.findIndex((cell) =>
    NAME_HEADER_PATTERNS.includes(cell)
  );

  if (phoneMatchIndex !== -1 || nameMatchIndex !== -1) {
    hasHeader = true;
    if (phoneMatchIndex !== -1) phoneColIndex = phoneMatchIndex;
    if (nameMatchIndex !== -1) nameColIndex = nameMatchIndex;
  }

  const startRowIndex = hasHeader ? 1 : 0;

  for (let i = startRowIndex; i < rows.length; i++) {
    const row = rows[i];

    // Skip empty or space-only rows
    if (!row || row.every((cell) => !cell || cell.trim() === '')) {
      continue;
    }

    const rawPhone = row[phoneColIndex] ? row[phoneColIndex].trim() : '';
    const rawName = row[nameColIndex] ? row[nameColIndex].trim() : '';

    // Formula injection sanitization for raw fields
    const sanitizedPhone = sanitizeFormula(rawPhone);
    const sanitizedName = sanitizeFormula(rawName);

    contacts.push({
      originalRowIndex: i + 1,
      originalName: sanitizedName,
      originalPhone: sanitizedPhone,
      source: 'csv',
    });
  }

  return {
    contacts,
    errors,
    totalRows: contacts.length,
  };
}

function sanitizeFormula(value: string): string {
  if (!value) return '';
  // If value starts with =, +, -, or @, prefix with a single quote for safe display/storage
  if (/^[=+\-@]/.test(value.trim())) {
    return `'${value.trim()}`;
  }
  return value.trim();
}
