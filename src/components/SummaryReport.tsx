'use client';

import React from 'react';
import { ProcessedContact } from '@/lib/types';
import {
  CheckCircle2,
  XCircle,
  Download,
  RotateCcw,
  ExternalLink,
  PlusCircle,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { downloadFailedContactsCsv, downloadCompleteReportCsv } from '@/lib/export-csv';

interface SummaryReportProps {
  contacts: ProcessedContact[];
  onRetryFailed: () => void;
  onReset: () => void;
}

export const SummaryReport: React.FC<SummaryReportProps> = ({
  contacts,
  onRetryFailed,
  onReset,
}) => {
  const savedCount = contacts.filter((c) => c.status === 'saved').length;
  const failedCount = contacts.filter((c) => c.status === 'failed').length;
  const duplicateCount = contacts.filter((c) => c.status === 'duplicate').length;
  const invalidCount = contacts.filter((c) => c.status === 'invalid' || c.status === 'needs_review').length;

  const failedContacts = contacts.filter((c) => c.status === 'failed');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Import Process Completed
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">
            Google Contacts Import Summary
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review the final outcome of your contact import below.
          </p>
        </div>

        <a
          href="https://contacts.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
          Open Google Contacts
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-xl">
          <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Saved Successfully
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-2">{savedCount}</div>
        </div>

        <div className="bg-rose-50/50 border border-rose-200 p-4 rounded-xl">
          <div className="text-xs font-semibold text-rose-800 flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-rose-600" />
            Failed to Save
          </div>
          <div className="text-3xl font-black text-rose-700 mt-2">{failedCount}</div>
        </div>

        <div className="bg-indigo-50/50 border border-indigo-200 p-4 rounded-xl">
          <div className="text-xs font-semibold text-indigo-800 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-indigo-600" />
            Skipped Duplicates
          </div>
          <div className="text-3xl font-black text-indigo-700 mt-2">{duplicateCount}</div>
        </div>

        <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl">
          <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Invalid / Skipped
          </div>
          <div className="text-3xl font-black text-amber-700 mt-2">{invalidCount}</div>
        </div>
      </div>

      {/* Failed Contacts Detailed Breakdown */}
      {failedContacts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-3">
          <h4 className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-rose-600" />
            Failed Contact Details ({failedContacts.length})
          </h4>
          <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 pr-1 text-xs font-mono">
            {failedContacts.map((c) => (
              <div key={c.id} className="bg-white p-2.5 rounded-lg border border-rose-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900">{c.finalName}</span> ({c.googleInternationalPhone})
                </div>
                <span className="text-rose-700 font-sans text-[11px]">
                  {c.saveError || 'Google API Failure'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          {failedCount > 0 && (
            <button
              type="button"
              onClick={onRetryFailed}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Failed ({failedCount})
            </button>
          )}

          {failedCount > 0 && (
            <button
              type="button"
              onClick={() => downloadFailedContactsCsv(contacts)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 text-xs rounded-xl shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-rose-600" />
              Download Failed CSV
            </button>
          )}

          <button
            type="button"
            onClick={() => downloadCompleteReportCsv(contacts)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 text-xs rounded-xl shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Download Full Report CSV
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors ml-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Start New Import
        </button>
      </div>
    </div>
  );
};
