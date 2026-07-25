'use client';

import React from 'react';
import { SaveProgress } from '@/lib/types';
import { RefreshCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface BatchProgressModalProps {
  isOpen: boolean;
  progress: SaveProgress;
}

export const BatchProgressModal: React.FC<BatchProgressModalProps> = ({
  isOpen,
  progress,
}) => {
  if (!isOpen) return null;

  const percentage = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Saving Contacts to Google...
            </h3>
            <p className="text-xs text-slate-500">
              Processing in controlled batches via Google People API
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-700">
              Processing {progress.current} of {progress.total}
            </span>
            <span className="text-blue-600">{percentage}%</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          {progress.currentContactName && (
            <p className="text-[11px] text-slate-500 font-mono truncate pt-1">
              Current: <span className="font-semibold text-slate-700">{progress.currentContactName}</span>
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
            <div className="flex items-center justify-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Saved
            </div>
            <div className="text-xl font-extrabold mt-1">{progress.saved}</div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
            <div className="flex items-center justify-center gap-1 font-semibold">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              Failed
            </div>
            <div className="text-xl font-extrabold mt-1">{progress.failed}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
            <div className="flex items-center justify-center gap-1 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
              Skipped
            </div>
            <div className="text-xl font-extrabold mt-1">{progress.skipped}</div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 text-center">
          Please keep this window open until contact saving completes.
        </p>
      </div>
    </div>
  );
};
