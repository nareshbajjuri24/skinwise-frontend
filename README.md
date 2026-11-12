# Skinwise — Smart Diet System (Frontend)

Skinwise is a personalized, budget-conscious smart diet planning web application focused on skin wellness and accessible nutrition. Built with React 18, Vite, React Router 6, Axios, Recharts, and Lucide React.

---

## 🌿 Application Overview

Skinwise helps individuals formulate an evidence-informed, affordable 12-week nutrition plan tailored to their skin profile (oily, dry, combination, sensitive, normal), skin concerns (acne, eczema, dryness, dullness, inflammation), allergies (dairy, nuts, gluten, soy, eggs), and regional weekly budget.

### Key Pages Included

- **Landing Page (`/`)**: Product introduction, 12-week adaptive system explanation, features grid, medical disclaimer, and call to action.
- **Registration Page (`/register`)**: Account creation with password validation and disclaimer agreement.
- **Login Page (`/login`)**: Secure sign-in with JWT storage and session restoration.
- **Dashboard (`/dashboard`)**: Welcome message, current plan week, today's meal checklist, budget tracking, and quick navigation.
- **Diet Assessment & Profile (`/profile`)**: Comprehensive form capturing skin characteristics, dietary preference, allergies, disliked foods, and regional budget.
- **7-Day Meal Plan (`/diet-plan`)**: Full 7-day view with 5 daily meals (Breakfast, 2 Snacks, Lunch, Dinner), portion sizes, nutrient breakdown, prep instructions, substitutes, cost tracker, and clean print/export PDF mode.
- **Weekly Feedback (`/feedback`)**: Collects meals followed, difficulty, hunger/fullness, affordability, and disliked items; automatically triggers the adaptive engine for the next week.
- **Progress Analytics (`/progress`)**: Genuine charts (adherence rate, budget vs. actual cost) and historical adaptation logs without fabricated data.
- **Settings & Logout (`/settings`)**: Account details, change password, and session termination.

---

## 📁 Folder Structure

```
skinwise-frontend/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── vercel.json
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── api/
    │   ├── client.js
    │   ├── authApi.js
    │   ├── profileApi.js
    │   ├── dietPlanApi.js
    │   ├── feedbackApi.js
    │   ├── progressApi.js
    │   └── catalogApi.js
    ├── context/
    │   └── AuthContext.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── MedicalDisclaimer.jsx
    │   └── MealCard.jsx
    └── pages/
        ├── LandingPage.jsx
        ├── LoginPage.jsx
        ├── RegisterPage.jsx
        ├── DashboardPage.jsx
        ├── ProfilePage.jsx
        ├── DietPlanPage.jsx
        ├── FeedbackPage.jsx
        ├── ProgressPage.jsx
        ├── SettingsPage.jsx
        └── NotFoundPage.jsx
```

---

## ⚙️ Prerequisites

- **Node.js**: v18.x, v20.x, or v22.x+ (Tested on Node v24.13.0)
- **npm**: v9.x+ (Tested on npm 11.9.0)

---

## 🚀 Local Development (Windows PowerShell)

### 1. Install Dependencies
```powershell
cd d:\java\skinwise-frontend
npm install
```

### 2. Configure Environment Variables
Copy the example configuration:
```powershell
Copy-Item .env.example .env
```
Ensure `VITE_API_BASE_URL` points to your backend instance:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Run Development Server
```powershell
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Run Production Build
```powershell
npm run build
```
The optimized bundle will be compiled into the `dist/` directory.

---

## 🌐 Vercel Deployment Guide

1. Push or import the `skinwise-frontend` directory into your Git provider (GitHub / GitLab).
2. On the [Vercel Dashboard](https://vercel.com), click **Add New Project**.
3. Select the repository and set:
   - **Framework Preset**: Vite
   - **Root Directory**: `skinwise-frontend` (if within a monorepo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-skinwise-backend.onrender.com/api` (Plain URL, no trailing slash, no Markdown)
5. Click **Deploy**. Vercel will build the frontend, and `vercel.json` ensures all client-side routes redirect to `index.html` seamlessly.

---

## ⚠️ Medical & Wellness Disclaimer
Skinwise is an educational wellness nutrition application. It does not diagnose, treat, or cure skin diseases, cystic acne, or other clinical dermatological conditions. It is intended to support balanced nutrition through budget-conscious regional foods.
