import Papa from 'papaparse';
import { ProcessedContact } from './types';

export function downloadSampleCsv() {
  const sampleData = [
    { Phone: '9876543210', Name: 'Rahul Kumar' },
    { Phone: '912345678901', Name: 'Priya Sharma' },
    { Phone: '+91 99887 76655', Name: 'Amit CSC' },
    { Phone: '0091-98112-34567', Name: 'Vikas Patel' },
  ];

  const csv = Papa.unparse(sampleData);
  triggerDownload(csv, 'sample_contacts_template.csv');
}

export function downloadFailedContactsCsv(contacts: ProcessedContact[]) {
  const failedList = contacts.filter((c) => c.status === 'failed' || c.status === 'invalid');

  const exportData = failedList.map((c) => ({
    'Original Row': c.originalRowIndex,
    'Original Phone': safeExportCell(c.originalPhone),
    'Original Name': safeExportCell(c.originalName),
    'Normalized Phone': safeExportCell(c.googleInternationalPhone),
    'Status': c.status,
    'Error / Reason': safeExportCell(c.saveError || c.validationMessage || 'Unknown error'),
  }));

  const csv = Papa.unparse(exportData);
  triggerDownload(csv, `failed_contacts_${formatTimestamp()}.csv`);
}

export function downloadCompleteReportCsv(contacts: ProcessedContact[]) {
  const exportData = contacts.map((c) => ({
    'Row Number': c.originalRowIndex,
    'Contact Name': safeExportCell(c.finalName),
    'Original Phone': safeExportCell(c.originalPhone),
    'Google Phone Number': safeExportCell(c.googleInternationalPhone),
    'Canonical Number': safeExportCell(c.normalizedCanonical),
    'Status': c.status,
    'Is Duplicate': c.isDuplicate ? 'Yes' : 'No',
    'Message / Error': safeExportCell(c.saveError || c.validationMessage || ''),
  }));

  const csv = Papa.unparse(exportData);
  triggerDownload(csv, `contact_import_report_${formatTimestamp()}.csv`);
}

function safeExportCell(value: string | undefined): string {
  if (!value) return '';
  const trimmed = value.trim();
  // Prevent CSV Formula Injection in spreadsheet software like Excel
  if (/^[=+\-@]/.test(trimmed)) {
    return `'${trimmed}`;
  }
  return trimmed;
}

function triggerDownload(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatTimestamp(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
}
