'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, ClipboardPaste } from 'lucide-react';
import { CsvUploader } from './CsvUploader';
import { CopyPasteArea } from './CopyPasteArea';
import { RawContactInput } from '@/lib/types';

interface ImportTabsProps {
  onParsed: (inputs: RawContactInput[]) => void;
}

export const ImportTabs: React.FC<ImportTabsProps> = ({ onParsed }) => {
  const [activeTab, setActiveTab] = useState<'csv' | 'paste'>('csv');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex border-b border-slate-200 bg-slate-50/80 p-1.5 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('csv')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'csv'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-blue-600" />
          A. Upload CSV File
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'paste'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ClipboardPaste className="w-4 h-4 text-indigo-600" />
          B. Copy & Paste Numbers
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'csv' ? (
          <CsvUploader onParsed={onParsed} />
        ) : (
          <CopyPasteArea onParsed={onParsed} />
        )}
      </div>
    </div>
  );
};
