# Bulk Google Contact Saver 🚀

A production-ready Next.js web application that enables users to upload CSV files or copy-paste Indian mobile numbers, clean and validate data, auto-deduplicate entries, and save valid contacts directly to their Google Account via official Google OAuth 2.0 and Google People API.

---

## 🔒 Security & Privacy Guarantee

> **CRITICAL SECURITY RULE:** This application **never asks for, collects, or stores the user's Gmail password**. Contacts are saved securely using official Google OAuth 2.0 authorization and Google People API permissions.

- 🔑 Secrets (`GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`) remain strictly server-side.
- 🛡️ CSRF & formula injection protection on CSV imports/exports.
- ⏱️ Temporary in-memory session processing — no permanent contact list database storage.

---

## ✨ Features

- **Google OAuth 2.0 Authentication**: Sign in with Google, display avatar & email, switch account (`prompt: select_account`), and sign out.
- **Dual Input Methods**:
  - **CSV Upload**: Drag-and-drop or file picker with auto-header detection (`phone`, `mobile`, `name`, `full name`, etc.), fallback to normalized number for blank names, downloadable sample template.
  - **Copy & Paste**: Multi-format line parser (`Auto detect`, `Numbers only`, `Number, Name`, `Number - Name`).
- **Indian Mobile Number Normalization**:
  - Converts `9876543210`, `919876543210`, `+91 98765 43210`, `0091-98765-43210` to canonical format `91XXXXXXXXXX`.
  - Saves to Google Contacts in international format `+91XXXXXXXXXX`.
  - Flags invalid numbers (<10 digits, >12 digits, non-numeric, wrong prefix) for manual review.
- **Smart Deduplication**: Automatically groups contacts by canonical number, keeps 1 entry, prefers non-empty names, and displays a collapsible duplicate details report.
- **Interactive Review & Edit Dashboard**: Inline edit names and numbers with live re-validation, status filters (`Valid`, `Needs Review`, `Invalid`, `Duplicate`, `Saved`, `Failed`), search bar, selection controls, and clear data trigger.
- **Optional Google Pre-Check**: Checks if numbers already exist in user's Google Contacts list to avoid overwriting.
- **Controlled Batch Saver**: Saves contacts in safe controlled batches with progress bar, real-time counters, and exponential backoff retries on rate limits (429 / 503).
- **Comprehensive Reports**: Download failed contacts CSV or full import report CSV, retry failed contacts, or jump directly to `contacts.google.com`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS, Lucide Icons
- **Authentication**: Auth.js / NextAuth.js (Google OAuth 2.0 Provider)
- **Google API**: Google People API (`googleapis`)
- **Parsers & Validation**: PapaParse, Zod
- **Deployment**: Vercel ready

---

## 📘 Google Cloud Console Setup Guide (Step-by-Step)

Follow these exact steps to obtain your Google OAuth 2.0 Credentials:

### Step 1: Create or Select a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown at the top bar and click **New Project**.
3. Enter Project Name (e.g. `Bulk Contact Saver`) and click **Create**.

### Step 2: Enable Google People API
1. In the left navigation menu, go to **APIs & Services** > **Library**.
2. Search for **Google People API**.
3. Click on **Google People API** from the results and click **Enable**.

### Step 3: Configure OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**.
2. Select User Type:
   - Choose **External** (unless you are a Google Workspace organization user).
3. Click **Create**.
4. Fill in basic application details:
   - **App name**: `Bulk Google Contact Saver`
   - **User support email**: Choose your email address
   - **Developer contact information**: Choose your email address
5. Click **Save and Continue**.

### Step 4: Add Required Scopes / Permissions
1. In the **Scopes** tab of OAuth consent screen, click **Add or Remove Scopes**.
2. Manually add or select the Google Contacts scope:
   `https://www.googleapis.com/auth/contacts`
3. Click **Update** and then **Save and Continue**.

### Step 5: Add Test Users (While in Testing Mode)
1. In the **Test Users** tab, click **+ Add Users**.
2. Add your Gmail address and any testing Gmail accounts.
3. Click **Save and Continue**.

### Step 6: Create OAuth 2.0 Client Credentials
1. Go to **APIs & Services** > **Credentials**.
2. Click **+ Create Credentials** > **OAuth client ID**.
3. Select Application type: **Web application**.
4. Set Name: `Bulk Contact Saver Web Client`.

### Step 7: Configure Authorized JavaScript Origins & Redirect URIs
Add the following entries under **Authorized JavaScript origins**:
- `http://localhost:3000`
- `https://your-app-name.vercel.app` (for production)

Add the following entries under **Authorized redirect URIs**:
- `http://localhost:3000/api/auth/callback/google`
- `https://your-app-name.vercel.app/api/auth/callback/google` (for production)

5. Click **Create**.
6. Copy your **Client ID** and **Client Secret**.

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in your root folder:

```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_SECRET=generate_random_secret_key_with_openssl
NEXTAUTH_URL=http://localhost:3000
```

---

## 🚀 Local Development Instructions

1. **Clone/Navigate to Project Directory**:
   ```bash
   cd bulk-google-contact-saver
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your web browser.

---

## ☁️ Vercel Deployment Instructions

1. Push your repository to GitHub or GitLab.
2. Go to [Vercel Console](https://vercel.com/) and click **Add New Project**.
3. Import your project repository.
4. Under **Environment Variables**, add:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (Set to your Vercel URL, e.g. `https://your-project.vercel.app`)
5. Click **Deploy**.

---

## ✅ Acceptance Test Matrix

| Test # | Input | Expected Output | Status |
|---|---|---|---|
| **Test 1** | `9876543210` | Name: `919876543210`, Google Phone: `+919876543210` | ✅ PASSED |
| **Test 2** | `9876543210,Rahul Kumar` | Name: `Rahul Kumar`, Google Phone: `+919876543210` | ✅ PASSED |
| **Test 3** | `919876543210,` | Name: `919876543210`, Google Phone: `+919876543210` | ✅ PASSED |
| **Test 4** | `9876543210`, `+91 98765 43210`, `919876543210` | Only 1 final contact after duplicate removal | ✅ PASSED |
| **Test 5** | `12345` | Marked as "Needs Review" / Invalid; not auto-saved | ✅ PASSED |
| **Test 6** | Auth as `example@gmail.com` | Contacts created only in `example@gmail.com` account | ✅ PASSED |
| **Test 7** | Temporary API errors | Retries with backoff; successful remain saved; summary CSV | ✅ PASSED |

---

## 📄 License & Terms

This project is open-source and intended for contact management automation under standard MIT terms.
