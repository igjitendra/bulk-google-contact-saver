import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';

async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) return { ...token, error: 'RefreshTokenMissing' };
  try {
    const body = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken,
    });
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token || token.refreshToken,
      error: undefined,
    };
  } catch {
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    authorization: { params: {
      scope: 'openid email profile https://www.googleapis.com/auth/contacts',
      prompt: 'select_account', access_type: 'offline', response_type: 'code',
    } },
  })],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/', error: '/' },
  callbacks: {
    async jwt({ token, account }) {
      if (account) return { ...token, accessToken: account.access_token, refreshToken: account.refresh_token, accessTokenExpires: (account.expires_at || 0) * 1000 };
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires - 60000) return token;
      return refreshAccessToken(token);
    },
    async session({ session, token }) { session.accessToken = token.accessToken; session.error = token.error; return session; },
  },
};

declare module 'next-auth' { interface Session { accessToken?: string; error?: string; } }
declare module 'next-auth/jwt' { interface JWT { accessToken?: string; refreshToken?: string; accessTokenExpires?: number; error?: string; } }
