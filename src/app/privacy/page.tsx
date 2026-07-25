import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Application
        </Link>

        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last updated: July 2026</p>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <h2 className="text-sm font-bold text-slate-800">1. Information Collection</h2>
          <p>
            Bulk Google Contact Saver processes phone numbers and contact names uploaded via CSV or pasted by the user. All processing occurs locally in memory or temporarily via secure API calls during your active session.
          </p>

          <h2 className="text-sm font-bold text-slate-800">2. Google Account Authorization</h2>
          <p>
            We use official Google OAuth 2.0 to request authorization for creating contacts in your Google Account (`https://www.googleapis.com/auth/contacts`). We never ask for, collect, or store your Gmail password.
          </p>

          <h2 className="text-sm font-bold text-slate-800">3. Data Retention</h2>
          <p>
            Uploaded contact lists are stored only in client browser state and memory during the active session. Contact details are never permanently stored on external servers or database instances.
          </p>

          <h2 className="text-sm font-bold text-slate-800">4. Third-Party Sharing</h2>
          <p>
            We do not share, sell, or monetize your contact data with any third-party advertising or data broker platforms.
          </p>
        </div>
      </div>
    </main>
  );
}
