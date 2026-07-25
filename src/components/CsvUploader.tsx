'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseCsvContent } from '@/lib/csv-parser';
import { downloadSampleCsv } from '@/lib/export-csv';
import { RawContactInput } from '@/lib/types';

interface CsvUploaderProps {
  onParsed: (inputs: RawContactInput[]) => void;
}

export const CsvUploader: React.FC<CsvUploaderProps> = ({ onParsed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setErrorMsg(null);

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMsg('Invalid file format. Please upload a valid .csv file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit warning
      setErrorMsg('File size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const result = parseCsvContent(text);

        if (result.errors.length > 0 && result.contacts.length === 0) {
          setErrorMsg(result.errors.join(', '));
        } else {
          onParsed(result.contacts);
        }
      } catch (err: any) {
        setErrorMsg(`Error parsing CSV file: ${err.message}`);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setErrorMsg('Failed to read CSV file.');
      setIsProcessing(false);
    };

    reader.readAsText(file, 'UTF-8');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
            : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-white'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
            <Upload className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Drag & Drop your CSV file here
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              or click to browse from your computer (UTF-8 encoded .csv)
            </p>
          </div>

          {fileName && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              <FileText className="w-4 h-4" />
              Selected: {fileName}
            </div>
          )}

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 max-w-sm">
            Expected columns: <span className="font-semibold text-slate-700">Column A (Phone)</span>,{' '}
            <span className="font-semibold text-slate-700">Column B (Contact Name)</span>. Works with or without header row.
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex items-center justify-between text-xs pt-1">
        <button
          type="button"
          onClick={downloadSampleCsv}
          className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          <Download className="w-3.5 h-3.5" />
          Download Sample CSV Template
        </button>

        <span className="text-slate-500">Max file size: 10 MB</span>
      </div>
    </div>
  );
};
