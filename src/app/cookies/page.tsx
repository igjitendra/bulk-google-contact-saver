import React from 'react';
import Link from 'next/link';
import { Cookie, ArrowLeft } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Application
        </Link>

        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Cookie className="w-6 h-6 text-amber-600" />
            Cookie Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last updated: July 2026</p>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <h2 className="text-sm font-bold text-slate-800">1. Use of Essential Cookies</h2>
          <p>
            Bulk Google Contact Saver uses strictly necessary encrypted HTTP-only session cookies powered by Auth.js / NextAuth to maintain secure user authentication state during your active Google OAuth session.
          </p>

          <h2 className="text-sm font-bold text-slate-800">2. No Tracking or Advertising Cookies</h2>
          <p>
            We do not use third-party analytics cookies, cross-site tracking technologies, or advertising cookies.
          </p>

          <h2 className="text-sm font-bold text-slate-800">3. Managing Cookies</h2>
          <p>
            You can clear or block cookies directly in your web browser settings. Clearing authentication cookies will automatically log you out of your session.
          </p>
        </div>
      </div>
    </main>
  );
}
