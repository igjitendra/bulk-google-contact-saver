import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { createSingleGoogleContact } from '@/lib/google-contacts';

const batchSchema = z.object({
  contacts: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'Name is required'),
      phone: z.string().min(1, 'Phone is required'),
    })
  ).min(1, 'At least one contact is required').max(50, 'Batch size limit exceeded'),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in with your Google account.' },
        { status: 401 }
      );
    }

    if (session.error === 'RefreshAccessTokenError' || session.error === 'RefreshTokenMissing') {
      return NextResponse.json(
        { error: 'Your Google authentication session has expired. Please sign out and sign in again.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parseResult = batchSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { contacts } = parseResult.data;

    // Process contacts with controlled concurrency (e.g. 5 at a time)
    const results = [];
    const chunkSize = 5;

    for (let i = 0; i < contacts.length; i += chunkSize) {
      const chunk = contacts.slice(i, i + chunkSize);
      const chunkPromises = chunk.map((contact) =>
        createSingleGoogleContact(session.accessToken!, {
          id: contact.id,
          name: contact.name,
          phone: contact.phone,
        })
      );

      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }

    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error during contact saving' },
      { status: 500 }
    );
  }
}
