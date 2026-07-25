import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, ExternalLink } from 'lucide-react';

export default function GoogleDisclosurePage() {
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
            Google API Limited Use Disclosure
          </h1>
          <p className="text-xs text-slate-500 mt-1">Compliance statement for Google User Data Policy</p>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 space-y-2">
            <h2 className="font-bold text-sm">Google API Services User Data Policy Compliance</h2>
            <p>
              Bulk Google Contact Saver&apos;s use and transfer to any other app of information received from Google APIs will adhere to{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline inline-flex items-center gap-1"
              >
                Google API Services User Data Policy
                <ExternalLink className="w-3 h-3" />
              </a>
              , including the Limited Use requirements.
            </p>
          </div>

          <h2 className="text-sm font-bold text-slate-800">1. Minimal Scope Permission Requested</h2>
          <p>
            We request only the minimum required scope (`https://www.googleapis.com/auth/contacts`) necessary to create contact records in the user&apos;s explicitly authorized Google Account via the official Google People API.
          </p>

          <h2 className="text-sm font-bold text-slate-800">2. No AI/ML Model Training</h2>
          <p>
            User data and contact information processed by Bulk Google Contact Saver are never used to train, retrain, or improve generalized AI or Machine Learning models.
          </p>

          <h2 className="text-sm font-bold text-slate-800">3. Human Data Access Restrictions</h2>
          <p>
            Human personnel do not read or inspect user contact information unless required for security compliance or explicit user support requests.
          </p>
        </div>
      </div>
    </main>
  );
}
