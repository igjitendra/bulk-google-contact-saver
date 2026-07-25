'use client';

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { LogIn, LogOut, UserCheck, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AuthCard: React.FC = () => {
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    signIn('google', undefined, { prompt: 'select_account' });
  };

  const handleChangeAccount = () => {
    signIn('google', undefined, { prompt: 'select_account' });
  };

  if (status === 'loading') {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-pulse flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-200"></div>
          <div className="space-y-2">
            <div className="w-32 h-4 bg-slate-200 rounded"></div>
            <div className="w-48 h-3 bg-slate-200 rounded"></div>
          </div>
        </div>
        <div className="w-28 h-9 bg-slate-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 transition-all">
      {!session ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              Google Account Connection Required
            </div>
            <h2 className="text-lg font-bold text-slate-900">Connect Google Account</h2>
            <p className="text-xs text-slate-600 max-w-md">
              Sign in to select the Google account where your cleaned mobile contacts will be saved directly via Google People API.
            </p>
          </div>

          <button
            onClick={handleSignIn}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-300 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User Profile'}
                  width={52}
                  height={52}
                  className="rounded-full border-2 border-blue-500 shadow-sm"
                />
              ) : (
                <div className="w-13 h-13 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg border-2 border-blue-500">
                  {session.user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{session.user?.name}</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-600 font-mono">{session.user?.email}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Contacts will save to this Google account.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <button
              onClick={handleChangeAccount}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Switch to another Google Account"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
              Change Account
            </button>

            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
