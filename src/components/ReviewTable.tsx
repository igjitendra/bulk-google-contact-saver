'use client';

import React, { useState } from 'react';
import { ProcessedContact, ValidationStatus } from '@/lib/types';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Edit2,
  Trash2,
  Save,
  Trash,
  ChevronDown,
  ChevronUp,
  CopyCheck,
  CheckSquare,
  Square,
  CloudUpload,
} from 'lucide-react';

interface ReviewTableProps {
  contacts: ProcessedContact[];
  onUpdateContact: (updated: ProcessedContact) => void;
  onDeleteContact: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onSelectAllValid: (select: boolean) => void;
  onClearAll: () => void;
  onEditClick: (contact: ProcessedContact) => void;
  onSaveTrigger: () => void;
  isAuthenticated: boolean;
}

export const ReviewTable: React.FC<ReviewTableProps> = ({
  contacts,
  onUpdateContact,
  onDeleteContact,
  onToggleSelect,
  onSelectAllValid,
  onClearAll,
  onEditClick,
  onSaveTrigger,
  isAuthenticated,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [showDuplicatesSection, setShowDuplicatesSection] = useState<boolean>(false);

  const duplicateItems = contacts.filter((c) => c.status === 'duplicate');

  // Filter contacts
  const filteredContacts = contacts.filter((c) => {
    // Exclude duplicates from main review list unless duplicate filter is explicitly selected
    if (filter !== 'duplicate' && c.status === 'duplicate') {
      return false;
    }

    if (filter === 'valid') return c.status === 'valid';
    if (filter === 'review') return c.status === 'needs_review' || c.status === 'invalid';
    if (filter === 'duplicate') return c.status === 'duplicate';
    if (filter === 'saved') return c.status === 'saved';
    if (filter === 'failed') return c.status === 'failed';

    return true;
  }).filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.finalName.toLowerCase().includes(q) ||
      c.originalPhone.includes(q) ||
      c.normalizedCanonical.includes(q) ||
      c.googleInternationalPhone.includes(q)
    );
  });

  const selectedCount = contacts.filter((c) => c.isSelected && c.status === 'valid').length;
  const allValidSelected =
    contacts.filter((c) => c.status === 'valid').length > 0 &&
    contacts.filter((c) => c.status === 'valid').every((c) => c.isSelected);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4 sm:p-6">
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 text-lg">Review & Edit Contacts</h3>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-semibold text-slate-600">
            {contacts.length} Total Rows
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectAllValid(!allValidSelected)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            {allValidSelected ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5 text-slate-500" />}
            Select All Valid
          </button>

          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors border border-rose-200"
          >
            <Trash className="w-3.5 h-3.5" />
            Clear All Data
          </button>

          <button
            type="button"
            onClick={onSaveTrigger}
            disabled={selectedCount === 0 || !isAuthenticated}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <CloudUpload className="w-4 h-4" />
            Save {selectedCount} Valid Contacts to Google
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, original phone, or +91 number..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'valid', label: 'Valid' },
            { id: 'review', label: 'Review & Fix' },
            { id: 'duplicate', label: `Duplicates (${duplicateItems.length})` },
            { id: 'saved', label: 'Saved' },
            { id: 'failed', label: 'Failed' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                filter === item.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Collapsible Duplicates Info Section */}
      {duplicateItems.length > 0 && (
        <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setShowDuplicatesSection(!showDuplicatesSection)}
            className="w-full p-3 flex items-center justify-between font-semibold text-indigo-900 hover:bg-indigo-100/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <CopyCheck className="w-4 h-4 text-indigo-600" />
              Auto-Deduplication Report: {duplicateItems.length} duplicate rows removed from batch
            </span>
            {showDuplicatesSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDuplicatesSection && (
            <div className="p-3 border-t border-indigo-200 bg-white space-y-2">
              <p className="text-slate-600">
                The following redundant rows were merged into a single canonical contact:
              </p>
              <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1 font-mono text-[11px]">
                {duplicateItems.map((dup) => (
                  <div key={dup.id} className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                    <span>
                      Row #{dup.originalRowIndex}: <strong>{dup.originalPhone}</strong> ({dup.originalName || 'No Name'})
                    </span>
                    <span className="text-indigo-700 font-semibold">{dup.validationMessage}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table for Desktop / Card layout for Mobile */}
      {filteredContacts.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          No contacts match your filter criteria.
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allValidSelected}
                    onChange={(e) => onSelectAllValid(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 w-16">Row #</th>
                <th className="py-3 px-3">Contact Name</th>
                <th className="py-3 px-3">Original Input</th>
                <th className="py-3 px-3">Normalized Google Phone</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredContacts.map((c) => (
                <tr
                  key={c.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    !c.isSelected ? 'opacity-75' : ''
                  }`}
                >
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={c.isSelected}
                      disabled={c.status === 'duplicate'}
                      onChange={() => onToggleSelect(c.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-500">
                    #{c.originalRowIndex}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {c.finalName}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {c.originalPhone}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">
                    {c.googleInternationalPhone || '—'}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={c.status} message={c.validationMessage || c.saveError} />
                  </td>
                  <td className="py-3 px-3 text-right space-x-1">
                    <button
                      type="button"
                      onClick={() => onEditClick(c)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Contact"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteContact(c.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

function StatusBadge({ status, message }: { status: ValidationStatus; message?: string }) {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let label: string = status;

  switch (status) {
    case 'valid':
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      label = 'Valid';
      break;
    case 'needs_review':
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
      label = 'Needs Review';
      break;
    case 'invalid':
      badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
      label = 'Invalid';
      break;
    case 'duplicate':
      badgeStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      label = 'Duplicate';
      break;
    case 'already_exists':
      badgeStyle = 'bg-cyan-50 text-cyan-700 border-cyan-200';
      label = 'Already Exists';
      break;
    case 'saved':
      badgeStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
      label = 'Saved';
      break;
    case 'failed':
      badgeStyle = 'bg-rose-600 text-white border-rose-600 font-bold';
      label = 'Failed';
      break;
  }

  return (
    <div className="inline-flex flex-col items-start gap-0.5">
      <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide rounded-md border ${badgeStyle}`}>
        {label}
      </span>
      {message && (
        <span className="text-[10px] text-slate-500 truncate max-w-[180px]" title={message}>
          {message}
        </span>
      )}
    </div>
  );
}
