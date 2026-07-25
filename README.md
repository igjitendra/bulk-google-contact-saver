# Bulk Google Contact Saver

A production-ready Next.js 14 app for importing, normalizing, deduplicating, reviewing, and saving Indian mobile numbers to Google Contacts.

## Local development

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`.
3. Add the Google OAuth values described below.
4. Run `npm run dev` and open `http://localhost:3000`.
5. Validate production output with `npm run build`.

## Google Cloud OAuth setup

1. Open **Google Cloud Console → APIs & Services** and select or create a project.
2. Open **Library** and enable **People API**.
3. Configure the **OAuth consent screen**. Add the scope `https://www.googleapis.com/auth/contacts`. If the app is in Testing, add every intended Google account as a test user.
4. Create an OAuth Client ID of type **Web application**.
5. For local development, add origin `http://localhost:3000` and redirect URI `http://localhost:3000/api/auth/callback/google`.
6. For production, add origin `https://your-app.vercel.app` and redirect URI `https://your-app.vercel.app/api/auth/callback/google`.

## Deploy with GitHub and Vercel

1. Push the full repository to GitHub.
2. In Vercel, choose **Add New → Project**, import the repository, and keep the detected Next.js settings.
3. Add these Production environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL=https://your-app.vercel.app`
4. Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`.
5. Deploy, then add the final Vercel domain to the Google OAuth origin and callback settings shown above.
6. Redeploy after changing environment variables.

No database or permanent contact storage is required. Contact data is processed in the browser and sent directly to Google through authenticated server routes.
