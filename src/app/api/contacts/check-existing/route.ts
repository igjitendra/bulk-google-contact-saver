import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { google } from 'googleapis';
import { normalizeIndianPhone } from '@/lib/phone-normalizer';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });
    const people = google.people({ version: 'v1', auth });

    // Fetch existing connections from Google Contacts (first 1000)
    const response = await people.people.connections.list({
      resourceName: 'people/me',
      pageSize: 1000,
      personFields: 'phoneNumbers,names',
    });

    const existingCanonicalNumbers = new Set<string>();

    if (response.data.connections) {
      response.data.connections.forEach((person) => {
        if (person.phoneNumbers) {
          person.phoneNumbers.forEach((p) => {
            if (p.value) {
              const norm = normalizeIndianPhone(p.value);
              if (norm.canonicalPhone) {
                existingCanonicalNumbers.add(norm.canonicalPhone);
              }
            }
          });
        }
      });
    }

    return NextResponse.json({
      existingCanonicalNumbers: Array.from(existingCanonicalNumbers),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch existing Google Contacts' },
      { status: 500 }
    );
  }
}
