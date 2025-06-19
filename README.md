# React-NestJS-Firebase Store 🛒

A modern, full-stack e-commerce platform built using:

- ⚛️ **React + Vite** (Frontend)
- 🐱 **NestJS** (Backend)
- 🔥 **Firebase** (Authentication, Firestore, Cloud Functions)
- 🎨 **Material UI** (Styling)
- 🗂️ **Monorepo** (with `apps/` and `libs/`)

---

## 📁 Monorepo Structure

```
.
├── apps/
│   ├── frontend/       # React + Vite e-commerce UI
│   └── backend/        # NestJS API (orders, users, auth)
├── libs/               # Shared utilities and types
├── .gitignore
├── firebase.json       # Firebase Hosting config
└── README.md
```

---

## 🔧 Features

### Frontend (`apps/frontend`)
- Built with **React + Vite**
- Styled using **Material UI**
- **Auth-ready** with Firebase (email/password, OAuth)
- **Responsive** layout with cart, checkout, order history
- Integrated **Stripe Checkout**

### Backend (`apps/backend`)
- Built with **NestJS**
- RESTful APIs for:
  - Users
  - Products
  - Orders
- Connected to **Firestore**
- Secured with Firebase Admin SDK

---

## 🚀 Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/urikhaimov/React-NestJS-FireBase-store.git
cd React-NestJS-FireBase-store
npm install
```

### 2. Start frontend

```bash
cd apps/frontend
npm install
npm run dev
```

### 3. Start backend

```bash
cd apps/backend
npm install
npm run start:dev
```

> 📌 Backend requires Firebase Admin credentials (see `.env` setup below)

---

## 🔐 Environment Variables

Create the following files from `.env.example`:

```bash
apps/frontend/.env
apps/backend/.env
```

Required variables:
- `VITE_FIREBASE_API_KEY=...`
- `VITE_STRIPE_PUBLIC_KEY=...`
- `FIREBASE_PROJECT_ID=...`
- `STRIPE_SECRET_KEY=...`

Never commit actual `.env` files!

---

## ☁️ Deployment

### 🔥 Firebase Hosting (Frontend)

```bash
cd apps/frontend
npm run build
firebase deploy
```

### 🐱 Deploy NestJS (Backend)

Option 1: [Render](https://render.com/)  
Option 2: [Railway](https://railway.app/)  
Option 3: Deploy as a Firebase Cloud Function (optional)

---

## 📦 Scripts

From project root or specific app folders:

```bash
npm run dev        # Run frontend in dev mode
npm run start:dev  # Run NestJS backend
npm run build      # Build frontend (Vite)
```

---

## 📄 License

MIT © [Uri Khaimov](https://github.com/urikhaimov)
