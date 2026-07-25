'use client';

import React from 'react';
import { AlertCircle, CloudUpload, ShieldCheck } from 'lucide-react';

interface SaveConfirmModalProps {
  isOpen: boolean;
  count: number;
  userEmail: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const SaveConfirmModal: React.FC<SaveConfirmModalProps> = ({
  isOpen,
  count,
  userEmail,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
          <CloudUpload className="w-6 h-6" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-slate-900">
            Confirm Save to Google Contacts
          </h3>
          <p className="text-xs text-slate-600">
            You are about to save <strong className="text-blue-700">{count} valid contacts</strong> directly to your Google Account:
          </p>
          <div className="inline-block bg-slate-100 text-slate-800 font-mono text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200">
            {userEmail}
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Contacts will be saved using official Google People API permissions. No password is asked or stored.
          </span>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20"
          >
            <CloudUpload className="w-4 h-4" />
            Save {count} Contacts Now
          </button>
        </div>
      </div>
    </div>
  );
};
