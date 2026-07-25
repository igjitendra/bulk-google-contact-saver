'use client';

import React from 'react';
import { Upload, CheckCircle2, CloudUpload } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
          1
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-blue-600" />
            Import Contacts
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload CSV or paste mobile numbers with optional contact names.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-100">
          2
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            Clean & Review
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Automatic Indian number normalization (+91) & duplicate removal.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-100">
          3
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
            <CloudUpload className="w-4 h-4 text-emerald-600" />
            Save to Google
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Bulk save directly into your Google Account via Google People API.
          </p>
        </div>
      </div>
    </div>
  );
};
