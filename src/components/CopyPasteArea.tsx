'use client';

import React, { useState } from 'react';
import { Clipboard, Sparkles, AlertCircle } from 'lucide-react';
import { parseTextContent, TextFormatMode } from '@/lib/text-parser';
import { RawContactInput } from '@/lib/types';

interface CopyPasteAreaProps {
  onParsed: (inputs: RawContactInput[]) => void;
}

export const CopyPasteArea: React.FC<CopyPasteAreaProps> = ({ onParsed }) => {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<TextFormatMode>('auto');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleParse = () => {
    setErrorMsg(null);
    if (!text.trim()) {
      setErrorMsg('Please paste phone numbers before processing.');
      return;
    }

    const parsed = parseTextContent(text, mode);
    if (parsed.length === 0) {
      setErrorMsg('No valid rows found in the pasted text.');
      return;
    }

    onParsed(parsed);
  };

  const lineCount = text.trim() ? text.trim().split(/\r?\n/).filter(Boolean).length : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Clipboard className="w-4 h-4 text-blue-600" />
          <span>Pasted Data Format:</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as TextFormatMode)}
            className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="auto">Auto detect (Comma, Hyphen, Tab)</option>
            <option value="numbers_only">Phone Numbers Only</option>
            <option value="number_name">Number & Name</option>
          </select>

          {lineCount > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-bold">
              {lineCount} lines
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Paste your contact list here (one per line):

Examples:
9876543210
912345678901
+91 98765 43210
9876543210, Rahul Kumar
9876543210 - Rahul Kumar
9876543210    Rahul Kumar`}
          className="w-full rounded-2xl border border-slate-300 p-4 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none shadow-inner resize-y custom-scrollbar"
        />
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setText('')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 underline"
        >
          Clear Textarea
        </button>

        <button
          type="button"
          onClick={handleParse}
          disabled={!text.trim()}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Sparkles className="w-4 h-4" />
          Process Pasted Contacts ({lineCount})
        </button>
      </div>
    </div>
  );
};
