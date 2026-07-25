import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Application
        </Link>

        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last updated: July 2026</p>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <h2 className="text-sm font-bold text-slate-800">1. Acceptable Use</h2>
          <p>
            You agree to use Bulk Google Contact Saver only for legitimate contact management purposes. You must have lawful permission to add contacts to your Google Account.
          </p>

          <h2 className="text-sm font-bold text-slate-800">2. Google API Compliance</h2>
          <p>
            This application complies with Google API Services User Data Policy, including the Limited Use requirements.
          </p>

          <h2 className="text-sm font-bold text-slate-800">3. Limitation of Liability</h2>
          <p>
            The software is provided "as is" without warranty of any kind. Users should verify contact lists before initiating saving operations.
          </p>
        </div>
      </div>
    </main>
  );
}
