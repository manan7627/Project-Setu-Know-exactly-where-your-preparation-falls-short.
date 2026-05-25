# 🚀 Project Setu: Production Deployment Guide

This guide outlines the best, smoothest, and free (or extremely low-cost) methods to deploy the **Next.js Frontend** and the **Headless WordPress (SQLite) Backend** in a live production environment.

---

## 🏛️ Deployment Architecture

```text
┌────────────────────────┐      HTTPS      ┌────────────────────────┐
│  Next.js Frontend      │ ──────────────> │ Headless WP API (PHP)  │
│  Hosted on Vercel      │                 │ Hosted on Fly.io/Render│
│  (100% Free Edge CDN)  │                 │ (Persistent SQLite Vol)│
└────────────────────────┘                 └────────────────────────┘
```

---

## 💻 Part 1: Frontend Deployment (Vercel)
**Cost:** $0 (Free Forever for Personal/Hobby Projects)  
**Effort:** Very Low (Automatic CI/CD on Git push)

Vercel is the creator of Next.js and provides the absolute best hosting platform for it.

### Setup Steps:
1. Go to [Vercel.com](https://vercel.com/) and sign up with your **GitHub Account**.
2. Click **"Add New"** > **"Project"**.
3. Import your GitHub repository: `Project-Setu-Know-exactly-where-your-preparation-falls-short.`.
4. In the configuration window:
   - **Root Directory:** Set this to `frontend` (Click edit and select the `frontend` folder).
   - **Framework Preset:** Next.js (automatically detected).
5. In **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` = `https://your-wordpress-api-url.com/wp-json` (Replace with your backend URL once deployed).
6. Click **Deploy**.
   *Vercel will build your Next.js project and provide you with a free `vercel.app` domain (which you can later point to a custom domain for free).*

---

## ⚙️ Part 2: Backend Deployment (WordPress & SQLite)
Because the backend is built on PHP and SQLite, it requires a host that runs PHP and supports **persistent storage** so your database (`.ht.sqlite`) is not wiped out when the server sleeps or restarts.

Here are the two best free options:

### Option A: Fly.io (Recommended for SQLite)
**Cost:** $0 (Free tier includes 3 VMs and 3GB of persistent volume space)  
**Pro:** Supports native persistent storage volumes, meaning your database is never wiped out. It has zero cold-start delay once running.

#### Setup Steps:
1. Install the [Flyctl CLI](https://fly.io/docs/hands-on/install-cli/) on your computer.
2. Run `fly auth signup` or `fly auth login`.
3. Create a `Dockerfile` inside the `wordpress` folder:
   ```dockerfile
   FROM php:8.2-apache
   RUN apt-get update && apt-get install -y libsqlite3-dev
   RUN docker-php-ext-install pdo pdo_sqlite
   RUN a2enmod rewrite
   COPY . /var/www/html/
   RUN chown -R www-data:www-data /var/www/html
   EXPOSE 80
   ```
4. Run `fly launch` inside the `wordpress` folder.
   - Choose a unique name for your API backend.
   - Set up a **1GB Persistent Volume** mounted at `/var/www/html/wp-content/database/` so that the SQLite database file `.ht.sqlite` remains persistent across redeployments.
5. In your Fly dashboard, configure the environment variable:
   - `GEMINI_API_KEY` = `your-gemini-key`

---

### Option B: Render.com (Easiest to Deploy)
**Cost:** $0 (Free Tier Web Service)  
**Con:** The free tier spins down after 15 minutes of inactivity (causing a 30-50 second delay on the first load). The storage is ephemeral, meaning any new user registrations or submissions will reset when the server restarts. *To prevent this, you would need to upgrade to Render's Paid Individual tier ($7/month) to attach a persistent disk.*

#### Setup Steps:
1. Sign up on [Render.com](https://render.com/) with GitHub.
2. Click **"New +"** > **"Web Service"**.
3. Select your GitHub repository.
4. In the configuration page:
   - **Root Directory:** `wordpress`
   - **Runtime:** `Docker` (Render will build your WordPress directory automatically if you add the Dockerfile shown in Option A, or you can choose `PHP` and connect a persistent disk).
   - **Instance Type:** Free.
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = `your-gemini-key`
6. Click **Deploy Web Service**.

---

## 🔒 Part 3: Connecting Frontend and Backend
Once both components are successfully deployed:

1. Copy your backend API URL (e.g., `https://setu-backend.fly.dev`).
2. Go to your **Vercel Dashboard** > **Project Settings** > **Environment Variables**.
3. Update `NEXT_PUBLIC_API_URL` to:
   `https://setu-backend.fly.dev/wp-json`
4. Trigger a redeploy in Vercel. Your frontend will now securely communicate with your live database and Gemini engine!
