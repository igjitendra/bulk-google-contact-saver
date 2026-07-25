import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Application
        </Link>

        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            Disclaimer & Limitations
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last updated: July 2026</p>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <h2 className="text-sm font-bold text-slate-800">1. Educational & Utility Purpose</h2>
          <p>
            Bulk Google Contact Saver is an independent utility tool designed to assist users in normalizing Indian mobile phone numbers and batch importing valid contact records into their authorized Google Account via official Google APIs.
          </p>

          <h2 className="text-sm font-bold text-slate-800">2. No Guarantee of Data Ownership</h2>
          <p>
            Users are solely responsible for ensuring that they have explicit permission, consent, and lawful authority to add contact information into their Google Account. The application is provided "as is" without warranty of data accuracy.
          </p>

          <h2 className="text-sm font-bold text-slate-800">3. Google Affiliation</h2>
          <p>
            This application is independent and is not affiliated, endorsed, or sponsored by Google LLC or Alphabet Inc. "Google", "Gmail", and "Google Contacts" are registered trademarks of Google LLC.
          </p>

          <h2 className="text-sm font-bold text-slate-800">4. Quota and Rate Limits</h2>
          <p>
            Bulk contact creation is subject to Google People API rate limits and quotas. Temporary service delays or failures caused by Google Cloud API policies are beyond our direct control.
          </p>
        </div>
      </div>
    </main>
  );
}
