import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bulk Google Contact Saver - Clean, Validate & Bulk Save Mobile Contacts',
  description:
    'Clean, validate Indian mobile numbers (+91), auto-remove duplicates, and bulk save contacts directly to your Google Account via Google OAuth 2.0 and Google People API.',
  keywords: [
    'Google Contacts Saver',
    'Bulk Contact Saver',
    'Indian Phone Normalization',
    'Google People API',
    'CSV Contact Import',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
