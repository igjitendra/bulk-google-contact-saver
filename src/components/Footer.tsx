'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-8 border-t border-slate-200 bg-white text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-slate-800 flex items-center justify-center md:justify-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Bulk Google Contact Saver
            </p>
            <p className="mt-0.5 text-slate-500">
              Official Google OAuth 2.0 & Google People API Contact Management Tool
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="hover:text-blue-600 transition-colors">
              Disclaimer
            </Link>
            <Link href="/cookies" className="hover:text-blue-600 transition-colors">
              Cookie Policy
            </Link>
            <Link href="/google-disclosure" className="hover:text-blue-600 font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
              Google API Disclosure
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} Bulk Google Contact Saver. All rights reserved.</p>
          <p>Designed for direct deployment on GitHub & Vercel</p>
        </div>
      </div>
    </footer>
  );
};
