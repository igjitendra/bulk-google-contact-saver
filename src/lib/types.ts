export type ValidationStatus = 
  | 'valid'
  | 'needs_review'
  | 'invalid'
  | 'duplicate'
  | 'already_exists'
  | 'saved'
  | 'failed';

export interface RawContactInput {
  originalRowIndex: number;
  originalName: string;
  originalPhone: string;
  source: 'csv' | 'paste';
}

export interface ProcessedContact {
  id: string;
  originalRowIndex: number;
  originalName: string;
  originalPhone: string;
  normalizedCanonical: string; // e.g. "919876543210"
  googleInternationalPhone: string; // e.g. "+919876543210"
  finalName: string;
  status: ValidationStatus;
  validationMessage?: string;
  isDuplicate: boolean;
  duplicateOriginalRows?: number[];
  isSelected: boolean;
  saveError?: string;
}

export interface ImportStats {
  totalImportedRows: number;
  validContacts: number;
  invalidContacts: number;
  duplicatesRemoved: number;
  readyToSave: number;
  alreadyExistsInGoogle?: number;
}

export interface SaveProgress {
  total: number;
  current: number;
  saved: number;
  failed: number;
  skipped: number;
  isProcessing: boolean;
  currentContactName?: string;
}

export interface BatchSaveResponse {
  results: {
    id: string;
    success: boolean;
    error?: string;
    resourceName?: string;
  }[];
}
