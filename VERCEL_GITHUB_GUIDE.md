# 🚀 Complete GitHub & Vercel Deployment Guide

This guide gives you the exact step-by-step instructions to upload **Bulk Google Contact Saver** to GitHub and deploy it on Vercel without running anything locally.

---

## 📌 Step 1: Upload Project to GitHub

### Option A: Using GitHub Web Interface (Easiest)
1. Go to [GitHub](https://github.com/) and sign in to your account.
2. Click the **`+`** icon in the top right corner and select **New repository**.
3. Name your repository: `bulk-google-contact-saver`.
4. Set visibility to **Public** or **Private**.
5. Do NOT initialize with a README (we already have a complete one ready).
6. Click **Create repository**.
7. Drag & drop all files from your project directory into the GitHub upload interface or push via Git.

### Option B: Using Git Command Line
```bash
git init
git add .
git commit -m "Initial commit: Bulk Google Contact Saver ready for Vercel"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/bulk-google-contact-saver.git
git push -u origin main
```

---

## 🔑 Step 2: Configure Google Cloud OAuth Credentials

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Go to **APIs & Services** > **Library** -> Search for **Google People API** -> Click **Enable**.
3. Go to **APIs & Services** > **OAuth consent screen**:
   - User Type: **External**
   - App Name: `Bulk Google Contact Saver`
   - Scopes: Add `https://www.googleapis.com/auth/contacts`
   - Add your Gmail in **Test Users**.
4. Go to **APIs & Services** > **Credentials**:
   - Click **+ Create Credentials** > **OAuth client ID**.
   - Application Type: **Web Application**.
   - **Authorized JavaScript origins**:
     - `https://your-vercel-app-name.vercel.app`
   - **Authorized redirect URIs**:
     - `https://your-vercel-app-name.vercel.app/api/auth/callback/google`
5. Copy your **Client ID** and **Client Secret**.

---

## ☁️ Step 3: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New Project**.
3. Select **Import Git Repository** and choose `bulk-google-contact-saver`.
4. Expand **Environment Variables** and add the following 4 variables:

| Variable Name | Value Description | Example |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID | `123456789-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret | `GOCSPX-abc123xyz...` |
| `NEXTAUTH_SECRET` | Random 32+ character string | `my_super_secret_random_key_998877` |
| `NEXTAUTH_URL` | Your production Vercel URL | `https://your-vercel-app-name.vercel.app` |

5. Click **Deploy**.
6. In ~60 seconds, your site will be live!

---

## 📜 All Legal & Compliance Pages Built

Your web app includes all required legal pages ready out-of-the-box:

- 🛡️ **Privacy Policy**: `/privacy`
- 📄 **Terms of Service**: `/terms`
- ⚠️ **Disclaimer**: `/disclaimer`
- 🍪 **Cookie Policy**: `/cookies`
- 🔒 **Google API Limited Use Disclosure**: `/google-disclosure`

All legal pages are linked in the website footer.
