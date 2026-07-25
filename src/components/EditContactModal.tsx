'use client';

import React, { useState, useEffect } from 'react';
import { ProcessedContact } from '@/lib/types';
import { normalizeIndianPhone } from '@/lib/phone-normalizer';
import { X, Check, AlertCircle } from 'lucide-react';

interface EditContactModalProps {
  contact: ProcessedContact | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ProcessedContact) => void;
}

export const EditContactModal: React.FC<EditContactModalProps> = ({
  contact,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (contact) {
      setName(contact.finalName);
      setPhone(contact.originalPhone);
    }
  }, [contact]);

  if (!isOpen || !contact) return null;

  const norm = normalizeIndianPhone(phone);

  const handleSave = () => {
    const fallbackName = norm.canonicalPhone ? norm.canonicalPhone : phone;
    const finalName = name.trim() ? name.trim() : fallbackName;

    const updated: ProcessedContact = {
      ...contact,
      finalName,
      originalPhone: phone,
      normalizedCanonical: norm.canonicalPhone,
      googleInternationalPhone: norm.googlePhone,
      status: norm.isValid
        ? 'valid'
        : norm.statusCode === 'NEEDS_REVIEW'
        ? 'needs_review'
        : 'invalid',
      validationMessage: norm.validationMessage,
      isSelected: norm.isValid,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            Edit Contact (Row #{contact.originalRowIndex})
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Contact Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Kumar"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Phone Number:
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Live Validation Preview */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Canonical (Internal):</span>
              <span className="font-bold text-slate-900">{norm.canonicalPhone || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Google Phone Format:</span>
              <span className="font-bold text-blue-700">{norm.googlePhone || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200">
              <span>Status:</span>
              <span
                className={`px-2 py-0.5 rounded font-bold ${
                  norm.isValid
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {norm.isValid ? 'VALID' : norm.statusCode}
              </span>
            </div>
            {norm.validationMessage && (
              <p className="text-amber-700 font-sans pt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                {norm.validationMessage}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
          >
            <Check className="w-4 h-4" />
            Save & Revalidate
          </button>
        </div>
      </div>
    </div>
  );
};
