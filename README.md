# Setu: Academic Gap Analysis & Mock Test Generator

> **Know exactly where your preparation falls short.**

Setu is a headless, AI-powered EdTech assessment platform that evaluates academic notes, essays, and study prep materials. By pairing a **Next.js** frontend with a headless **WordPress (SQLite)** backend, Setu uses **Google Gemini 2.5 Flash** to perform structured analysis of study notes against specific exam syllabi (e.g., UPSC, GATE). It returns a readiness score, detailed written critiques, identifies specific gaps, and compiles custom mock tests targeted at those exact gaps.

---

## ✨ Features

- **Warm & Professional Interface:** Responsive light theme built with Tailwind CSS, custom Lucide icons, and fluid Framer Motion micro-animations.
- **AI Readiness Scoring (0-100):** Real-time evaluation of notes against competitive exams, displaying progress in color-coded score gauges.
- **Automated Skill Gap Identification:** Pinpoints missing topics, weak arguments, or incorrect terminology in student submissions.
- **Adaptive Mock Tests:** Generates targeted Multiple-Choice Questions (MCQs) mapped precisely to the user's identified weak areas.
- **Portability via SQLite:** Eliminates heavy database management by using a lightweight, self-contained SQLite configuration.
- **Asynchronous Background Grading:** Employs WordPress background cron tasks to process assessments within 5-15 seconds without stalling user interaction.
- **Secure HMAC Auth:** Formulates custom cryptographic tokens (`Header.Payload.Signature`) using HMAC-SHA256 for secure endpoint communications.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js (Page router), React, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Headless WordPress (PHP local server)
- **Database:** SQLite (embedded within `wordpress/wp-content/database/`)
- **Assessment Engine:** Google Gemini 2.5 Flash API (Structured Output schema validation)

---

## 📂 Repository Structure

```text
├── frontend/                   # Next.js Application
│   ├── components/             # Layout and reusable shell components
│   ├── pages/                  # Route handlers (Landing, Dashboard, Analyze, Results, Settings)
│   ├── public/                 # Static assets (including Custom Logo.png)
│   ├── styles/                 # Tailwind design tokens and CSS variables
│   └── package.json            # Frontend dependency specifications
│
├── wordpress/                  # WordPress Core & Plugins
│   ├── wp-content/
│   │   ├── database/           # SQLite Database (.ht.sqlite file)
│   │   └── plugins/
│   │       ├── setu-core/      # Custom PHP REST API & Gemini Integration Plugin
│   │       └── sqlite-db-...   # SQLite database engine wrapper
│   └── wp-config.php           # Local environment configuration & API constants
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** (v18.x or higher)
- **PHP** (v8.1 or higher) with the **SQLite3** extension enabled in your `php.ini`.

---

### Step 1: Clone and Configure the Backend

1. Navigate to the `wordpress` folder:
   ```bash
   cd wordpress
   ```

2. Open `wp-config.php` and configure your **Google Gemini API Key**:
   ```php
   // Define your Gemini 2.5 Flash API Key here:
   define('GEMINI_API_KEY', 'your-actual-gemini-api-key');
   ```

3. Spin up the WordPress PHP development server:
   ```bash
   php -S localhost:8080
   ```
   *The WordPress backend will now be active at `http://localhost:8080`.*

---

### Step 2: Configure and Run the Frontend

1. Open a new terminal session and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the Next.js development server:
   ```bash
   npm run dev
   ```
   *The application will boot at `http://localhost:3000`.*

---

## 🔒 Custom HMAC Authentication

Setu bypasses traditional session cookies by signing and verifying stateless request headers. Custom routes under `setu/v1` require authorization headers formatted as:

```http
Authorization: Bearer <Header>.<Payload>.<Signature>
```

Tokens are verified on the backend using the local WordPress `SECURE_AUTH_KEY` to authenticate request structures and ensure payload integrity.

---

## 🔌 API Documentation

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/wp-json/setu/v1/login` | `POST` | No | Validates user credentials; returns JWT-like bearer token. |
| `/wp-json/setu/v1/submit` | `POST` | Yes | Saves content, marks status as `pending`, and initiates background grading. |
| `/wp-json/setu/v1/results` | `GET` | Yes | Returns a list of past assessments (IDs, scores, exam categories). |
| `/wp-json/setu/v1/results/{id}` | `GET` | Yes | Retrieves full score details, evaluation text, skill gaps, and generated MCQs. |

---

## 📖 System Details

For an in-depth, itemized breakdown of technical decisions, code modules, database configurations, and compiler solutions, see the [A-to-Z System Summary](SUMMARY.md).
