'use client';

import React from 'react';
import { ImportStats } from '@/lib/types';
import { CheckCircle2, AlertTriangle, CopyCheck, Save, Search, RefreshCw } from 'lucide-react';

interface StatsDashboardProps {
  stats: ImportStats;
  onCheckExisting?: () => void;
  isCheckingExisting?: boolean;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  stats,
  onCheckExisting,
  isCheckingExisting = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-500">Total Imported</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {stats.totalImportedRows}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Raw rows read</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Valid Contacts
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {stats.validContacts}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Ready for export</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-semibold text-amber-700 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Needs Review / Invalid
          </div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">
            {stats.invalidContacts}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">Manual fix required</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-semibold text-indigo-700 flex items-center gap-1">
            <CopyCheck className="w-3.5 h-3.5 text-indigo-600" />
            Duplicates Removed
          </div>
          <div className="text-2xl font-extrabold text-indigo-700 mt-1">
            {stats.duplicatesRemoved}
          </div>
          <div className="text-[11px] text-indigo-600 mt-1">Auto-merged rows</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="text-xs font-semibold text-blue-700 flex items-center gap-1">
            <Save className="w-3.5 h-3.5 text-blue-600" />
            Ready to Save
          </div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">
            {stats.readyToSave}
          </div>
          <div className="text-[11px] text-blue-600 mt-1">Target to Google</div>
        </div>
      </div>

      {onCheckExisting && (
        <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Search className="w-4 h-4 text-blue-600" />
            <span>Optional: Pre-check if any numbers already exist in your Google Contacts account.</span>
          </div>

          <button
            type="button"
            onClick={onCheckExisting}
            disabled={isCheckingExisting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 rounded-lg shadow-sm transition-colors"
          >
            {isCheckingExisting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                Checking Google...
              </>
            ) : (
              'Check Google Existing'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
