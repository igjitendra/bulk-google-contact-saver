import { RawContactInput, ProcessedContact, ImportStats } from './types';
import { normalizeIndianPhone } from './phone-normalizer';

export interface ProcessPipelineResult {
  processedContacts: ProcessedContact[];
  stats: ImportStats;
  duplicateGroups: {
    canonicalPhone: string;
    chosenContact: ProcessedContact;
    allRowIndices: number[];
  }[];
}

export function processAndDeduplicate(rawInputs: RawContactInput[]): ProcessPipelineResult {
  if (!rawInputs || rawInputs.length === 0) {
    return {
      processedContacts: [],
      stats: {
        totalImportedRows: 0,
        validContacts: 0,
        invalidContacts: 0,
        duplicatesRemoved: 0,
        readyToSave: 0,
      },
      duplicateGroups: [],
    };
  }

  // 1. Initial Normalization & Validation of all rows
  const initialProcessed: ProcessedContact[] = rawInputs.map((input) => {
    const norm = normalizeIndianPhone(input.originalPhone);

    // Default fallback name if name is empty
    const fallbackName = norm.canonicalPhone
      ? norm.canonicalPhone
      : input.originalPhone || `Contact #${input.originalRowIndex}`;

    const finalName = input.originalName && input.originalName.trim() !== ''
      ? input.originalName.trim()
      : fallbackName;

    return {
      id: `contact-${input.originalRowIndex}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      originalRowIndex: input.originalRowIndex,
      originalName: input.originalName,
      originalPhone: input.originalPhone,
      normalizedCanonical: norm.canonicalPhone,
      googleInternationalPhone: norm.googlePhone,
      finalName: finalName,
      status: norm.isValid
        ? 'valid'
        : norm.statusCode === 'NEEDS_REVIEW'
        ? 'needs_review'
        : 'invalid',
      validationMessage: norm.validationMessage,
      isDuplicate: false,
      isSelected: norm.isValid, // Pre-select valid rows by default
    };
  });

  // 2. Group by Canonical Phone (only for items with a non-empty canonical phone)
  const canonicalMap = new Map<string, ProcessedContact[]>();
  const invalidOrUnprocessable: ProcessedContact[] = [];

  initialProcessed.forEach((contact) => {
    if (!contact.normalizedCanonical) {
      invalidOrUnprocessable.push(contact);
    } else {
      const existing = canonicalMap.get(contact.normalizedCanonical) || [];
      existing.push(contact);
      canonicalMap.set(contact.normalizedCanonical, existing);
    }
  });

  const deduplicatedContacts: ProcessedContact[] = [];
  const duplicateGroups: {
    canonicalPhone: string;
    chosenContact: ProcessedContact;
    allRowIndices: number[];
  }[] = [];

  let duplicatesRemovedCount = 0;

  canonicalMap.forEach((group, canonicalPhone) => {
    if (group.length === 1) {
      deduplicatedContacts.push(group[0]);
    } else {
      // Multiple items exist for this canonical phone number!
      duplicatesRemovedCount += group.length - 1;

      // Prefer the first contact with a non-empty, non-phone original name
      let bestContact = group.find(
        (c) => c.originalName && c.originalName.trim() !== '' && c.originalName.trim() !== c.normalizedCanonical
      );

      if (!bestContact) {
        bestContact = group[0];
      }

      const allRowIndices = group.map((c) => c.originalRowIndex);

      const mergedContact: ProcessedContact = {
        ...bestContact,
        isDuplicate: false,
        duplicateOriginalRows: allRowIndices,
      };

      deduplicatedContacts.push(mergedContact);

      duplicateGroups.push({
        canonicalPhone,
        chosenContact: mergedContact,
        allRowIndices,
      });

      // Mark the others as duplicates for detailed view/records if needed
      group.forEach((dup) => {
        if (dup.id !== bestContact!.id) {
          deduplicatedContacts.push({
            ...dup,
            status: 'duplicate',
            isDuplicate: true,
            isSelected: false,
            validationMessage: `Duplicate of Row #${bestContact!.originalRowIndex} (${canonicalPhone})`,
          });
        }
      });
    }
  });

  // Combine non-duplicate list with invalid items
  const finalProcessedList = [...deduplicatedContacts, ...invalidOrUnprocessable].sort(
    (a, b) => a.originalRowIndex - b.originalRowIndex
  );

  // Compute Statistics
  const validCount = finalProcessedList.filter(
    (c) => c.status === 'valid' && !c.isDuplicate
  ).length;
  const invalidCount = finalProcessedList.filter(
    (c) => (c.status === 'invalid' || c.status === 'needs_review') && !c.isDuplicate
  ).length;

  return {
    processedContacts: finalProcessedList,
    stats: {
      totalImportedRows: rawInputs.length,
      validContacts: validCount,
      invalidContacts: invalidCount,
      duplicatesRemoved: duplicatesRemovedCount,
      readyToSave: validCount,
    },
    duplicateGroups,
  };
}
