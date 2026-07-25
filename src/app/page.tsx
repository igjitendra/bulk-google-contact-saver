'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { AuthCard } from '@/components/AuthCard';
import { HowItWorks } from '@/components/HowItWorks';
import { ImportTabs } from '@/components/ImportTabs';
import { StatsDashboard } from '@/components/StatsDashboard';
import { ReviewTable } from '@/components/ReviewTable';
import { EditContactModal } from '@/components/EditContactModal';
import { SaveConfirmModal } from '@/components/SaveConfirmModal';
import { BatchProgressModal } from '@/components/BatchProgressModal';
import { SummaryReport } from '@/components/SummaryReport';
import { SecurityNotice } from '@/components/SecurityNotice';
import { Footer } from '@/components/Footer';

import { RawContactInput, ProcessedContact, ImportStats, SaveProgress } from '@/lib/types';
import { processAndDeduplicate } from '@/lib/duplicate-detector';
import { normalizeIndianPhone } from '@/lib/phone-normalizer';

export default function HomePage() {
  const { data: session } = useSession();

  const [contacts, setContacts] = useState<ProcessedContact[]>([]);
  const [stats, setStats] = useState<ImportStats>({
    totalImportedRows: 0,
    validContacts: 0,
    invalidContacts: 0,
    duplicatesRemoved: 0,
    readyToSave: 0,
  });

  const [isImported, setIsImported] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Modals state
  const [editingContact, setEditingContact] = useState<ProcessedContact | null>(null);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState<boolean>(false);
  const [isProgressOpen, setIsProgressOpen] = useState<boolean>(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState<boolean>(false);

  // Save Progress
  const [progress, setProgress] = useState<SaveProgress>({
    total: 0,
    current: 0,
    saved: 0,
    failed: 0,
    skipped: 0,
    isProcessing: false,
  });

  // 1. Handle New Raw Inputs (from CSV or Copy-Paste)
  const handleParsedInputs = (rawInputs: RawContactInput[]) => {
    const { processedContacts, stats: newStats } = processAndDeduplicate(rawInputs);
    setContacts(processedContacts);
    setStats(newStats);
    setIsImported(true);
    setIsFinished(false);
  };

  // 2. Inline Contact Editing
  const handleUpdateContact = (updated: ProcessedContact) => {
    const nextContacts = contacts.map((c) => (c.id === updated.id ? updated : c));
    recalculateState(nextContacts);
  };

  // 3. Contact Deletion
  const handleDeleteContact = (id: string) => {
    const nextContacts = contacts.filter((c) => c.id !== id);
    recalculateState(nextContacts);
  };

  // 4. Toggle Select
  const handleToggleSelect = (id: string) => {
    const nextContacts = contacts.map((c) =>
      c.id === id ? { ...c, isSelected: !c.isSelected } : c
    );
    recalculateState(nextContacts);
  };

  // 5. Select All Valid
  const handleSelectAllValid = (select: boolean) => {
    const nextContacts = contacts.map((c) =>
      c.status === 'valid' ? { ...c, isSelected: select } : c
    );
    recalculateState(nextContacts);
  };

  // 6. Clear All Data
  const handleClearAll = () => {
    setContacts([]);
    setStats({
      totalImportedRows: 0,
      validContacts: 0,
      invalidContacts: 0,
      duplicatesRemoved: 0,
      readyToSave: 0,
    });
    setIsImported(false);
    setIsFinished(false);
  };

  // Helper: Recalculate stats after edit/delete/selection
  const recalculateState = (nextContacts: ProcessedContact[]) => {
    const validCount = nextContacts.filter((c) => c.status === 'valid' && !c.isDuplicate).length;
    const invalidCount = nextContacts.filter(
      (c) => (c.status === 'invalid' || c.status === 'needs_review') && !c.isDuplicate
    ).length;
    const selectedValid = nextContacts.filter((c) => c.status === 'valid' && c.isSelected).length;

    setContacts(nextContacts);
    setStats((prev) => ({
      ...prev,
      validContacts: validCount,
      invalidContacts: invalidCount,
      readyToSave: selectedValid,
    }));
  };

  // 7. Optional Pre-check existing contacts in Google
  const handleCheckExisting = async () => {
    if (!session) return;
    setIsCheckingExisting(true);

    try {
      const res = await fetch('/api/contacts/check-existing', { method: 'POST' });
      const data = await res.json();

      if (res.ok && data.existingCanonicalNumbers) {
        const existingSet = new Set<string>(data.existingCanonicalNumbers);
        const nextContacts = contacts.map((c) => {
          if (c.normalizedCanonical && existingSet.has(c.normalizedCanonical)) {
            return {
              ...c,
              status: 'already_exists' as const,
              isSelected: false,
              validationMessage: 'Already exists in your Google Contacts account',
            };
          }
          return c;
        });

        recalculateState(nextContacts);
      }
    } catch (err) {
      console.error('Failed to pre-check existing contacts', err);
    } finally {
      setIsCheckingExisting(false);
    }
  };

  // 8. Start Saving Process
  const handleConfirmSave = async () => {
    setIsSaveConfirmOpen(false);

    // Target contacts: selected valid contacts
    const targetContacts = contacts.filter((c) => c.isSelected && (c.status === 'valid' || c.status === 'failed'));
    if (targetContacts.length === 0) return;

    setIsProgressOpen(true);
    setProgress({
      total: targetContacts.length,
      current: 0,
      saved: 0,
      failed: 0,
      skipped: 0,
      isProcessing: true,
    });

    const batchSize = 10;
    const updatedContactsList = [...contacts];

    for (let i = 0; i < targetContacts.length; i += batchSize) {
      const chunk = targetContacts.slice(i, i + batchSize);

      // Update active contact name indicator
      setProgress((prev) => ({
        ...prev,
        currentContactName: chunk[0].finalName,
      }));

      try {
        const res = await fetch('/api/contacts/save-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contacts: chunk.map((c) => ({
              id: c.id,
              name: c.finalName,
              phone: c.googleInternationalPhone,
            })),
          }),
        });

        const data = await res.json();

        if (res.ok && data.results) {
          data.results.forEach((resItem: any) => {
            const index = updatedContactsList.findIndex((c) => c.id === resItem.id);
            if (index !== -1) {
              if (resItem.success) {
                updatedContactsList[index] = {
                  ...updatedContactsList[index],
                  status: 'saved',
                  isSelected: false,
                  saveError: undefined,
                };
                setProgress((prev) => ({ ...prev, saved: prev.saved + 1 }));
              } else {
                updatedContactsList[index] = {
                  ...updatedContactsList[index],
                  status: 'failed',
                  saveError: resItem.error || 'Failed to create contact',
                };
                setProgress((prev) => ({ ...prev, failed: prev.failed + 1 }));
              }
            }
          });
        } else {
          // Entire chunk failed
          chunk.forEach((c) => {
            const index = updatedContactsList.findIndex((item) => item.id === c.id);
            if (index !== -1) {
              updatedContactsList[index] = {
                ...updatedContactsList[index],
                status: 'failed',
                saveError: data.error || 'Batch creation error',
              };
            }
          });
          setProgress((prev) => ({ ...prev, failed: prev.failed + chunk.length }));
        }
      } catch (err: any) {
        chunk.forEach((c) => {
          const index = updatedContactsList.findIndex((item) => item.id === c.id);
          if (index !== -1) {
            updatedContactsList[index] = {
              ...updatedContactsList[index],
              status: 'failed',
              saveError: err.message || 'Network error',
            };
          }
        });
        setProgress((prev) => ({ ...prev, failed: prev.failed + chunk.length }));
      }

      setProgress((prev) => ({
        ...prev,
        current: Math.min(prev.total, i + chunk.length),
      }));
    }

    setContacts(updatedContactsList);
    setIsProgressOpen(false);
    setIsFinished(true);
  };

  // 9. Retry Failed Contacts
  const handleRetryFailed = () => {
    // Re-select all failed contacts for retry
    const nextContacts = contacts.map((c) =>
      c.status === 'failed' ? { ...c, isSelected: true } : c
    );
    setContacts(nextContacts);
    setIsSaveConfirmOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Authentication Banner */}
        <AuthCard />

        {/* How It Works Guide */}
        <HowItWorks />

        {!isImported ? (
          /* Step 1: Input Tabs */
          <ImportTabs onParsed={handleParsedInputs} />
        ) : isFinished ? (
          /* Step 3: Summary Report */
          <SummaryReport
            contacts={contacts}
            onRetryFailed={handleRetryFailed}
            onReset={handleClearAll}
          />
        ) : (
          /* Step 2: Review & Edit Dashboard */
          <div className="space-y-6">
            <StatsDashboard
              stats={stats}
              onCheckExisting={session ? handleCheckExisting : undefined}
              isCheckingExisting={isCheckingExisting}
            />

            <ReviewTable
              contacts={contacts}
              onUpdateContact={handleUpdateContact}
              onDeleteContact={handleDeleteContact}
              onToggleSelect={handleToggleSelect}
              onSelectAllValid={handleSelectAllValid}
              onClearAll={handleClearAll}
              onEditClick={(c) => setEditingContact(c)}
              onSaveTrigger={() => setIsSaveConfirmOpen(true)}
              isAuthenticated={!!session}
            />
          </div>
        )}

        {/* Security & Privacy Notice */}
        <SecurityNotice />
      </main>

      <Footer />

      {/* Modals */}
      <EditContactModal
        contact={editingContact}
        isOpen={!!editingContact}
        onClose={() => setEditingContact(null)}
        onSave={handleUpdateContact}
      />

      <SaveConfirmModal
        isOpen={isSaveConfirmOpen}
        count={contacts.filter((c) => c.isSelected && (c.status === 'valid' || c.status === 'failed')).length}
        userEmail={session?.user?.email || 'authenticated Google Account'}
        onClose={() => setIsSaveConfirmOpen(false)}
        onConfirm={handleConfirmSave}
      />

      <BatchProgressModal isOpen={isProgressOpen} progress={progress} />
    </div>
  );
}
