# Linkfluence

*A creator–brand collaboration platform that helps **small creators** and **emerging brands** find each other, run campaigns, and grow together.*

<p>
  <a href="https://img.shields.io/badge/stack-MERN-blue"> <img alt="MERN" src="https://img.shields.io/badge/stack-MERN-blue"/> </a>
  <a href="https://img.shields.io/badge/ui-TailwindCSS-38bdf8"> <img alt="Tailwind CSS" src="https://img.shields.io/badge/ui-TailwindCSS-38bdf8"/> </a>
  <a href="https://img.shields.io/badge/build-React-61dafb"> <img alt="React" src="https://img.shields.io/badge/build-React-61dafb"/> </a>
  <a href="https://img.shields.io/badge/api-Node%2FExpress-339933"> <img alt="Node/Express" src="https://img.shields.io/badge/api-Node%2FExpress-339933"/> </a>
  <a href="https://img.shields.io/badge/database-MongoDB-47A248"> <img alt="MongoDB" src="https://img.shields.io/badge/database-MongoDB-47A248"/> </a>
  <a href="https://img.shields.io/badge/license-MIT-success"> <img alt="License" src="https://img.shields.io/badge/license-MIT-success"/> </a>
</p>

> **Vision:** In today’s creator economy, big brands partner with big creators. **Linkfluence** makes it easy for **small brands** and **small creators** to collaborate, run transparent campaigns, and get paid fairly.

---

## ✨ Features

**For Creators**

* Create a profile with niche, audience size, platforms & rates
* Browse brand campaigns with clear deliverables & budgets
* Apply to campaigns, chat with brands, track milestones
* Simple payout workflow (status: proposed → accepted → submitted → approved → paid)

**For Brands**

* Post campaigns with deliverables, timelines, and budgets
* Smart matching & search (by niche, platform, audience, location)
* Shortlist creators and manage outreach in one inbox
* Approve submissions and manage payouts

**Platform**

* JWT auth, role-based access (creator/brand/admin)
* Campaign lifecycle & milestone tracking
* Messages & notifications
* Reviews & ratings after campaign completion
* Admin dashboard for moderation & insights

> **Roadmap:** escrow-style holds, Stripe/PayPal payouts, brief templates, analytics for CTR/engagement, AI-assisted matching.

---

## 🧰 Tech Stack

* **Frontend:** React + Vite, Tailwind CSS, React Router, React Query (TanStack)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (+ Mongoose)
* **Auth:** JWT (access/refresh), bcrypt
* **State/Data:** React Query; optional Redux Toolkit depending on scale
* **Testing:** Vitest/Jest (client), Jest + Supertest (server)
* **Tooling:** ESLint, Prettier, Husky + lint-staged

---

## 🗺️ Architecture

```
client/ (React + Tailwind)
  src/
    components/
    pages/
    hooks/
    features/
    lib/
    api/
server/ (Node + Express)
  src/
    models/        # Mongoose schemas (User, CreatorProfile, BrandProfile, Campaign, Application, Message, Review)
    routes/        # /auth, /users, /profiles, /campaigns, /applications, /messages, /reviews
    controllers/
    middleware/    # auth, roles, errorHandler, rateLimiter
    services/      # matching, notifications, storage
    utils/
  tests/

shared/ (optional) # shared types/constants
```

**Flow:**

1. Brand posts a campaign → 2. Creators apply → 3. Brand accepts & sets milestones → 4. Creator submits proofs → 5. Brand approves → 6. Payout & mutual reviews.

---

## 📦 Monorepo Structure

```
linkfluence/
├─ client/
├─ server/
├─ README.md
└─ .editorconfig
```

---

## ⚙️ Prerequisites

* Node.js ≥ 18
* npm or pnpm/yarn
* MongoDB (local or Atlas)

---

## 🔐 Environment Variables

Create `.env` files as shown.

**server/.env**

```env
# App
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/linkfluence

# Auth
JWT_ACCESS_SECRET=replace-with-strong-secret
JWT_REFRESH_SECRET=replace-with-another-strong-secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Mail (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_password

# Storage (optional)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

**client/.env**

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Quick Start

```bash
# 1) Clone the repo
git clone https://github.com/<your-username>/linkfluence.git
cd linkfluence

# 2) Install deps
cd client && npm i && cd ..
cd server && npm i && cd ..

# 3) Setup envs
# create client/.env and server/.env using the examples above

# 4) Run dev (two terminals)
cd server && npm run dev
cd client && npm run dev

# Client: http://localhost:5173
# API:    http://localhost:5000/api
```

**Recommended npm scripts**

*client/package.json*

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

*server/package.json*

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts || nodemon src/index.js",
    "start": "node src/index.js",
    "lint": "eslint .",
    "test": "jest"
  }
}
```

---

## 🧪 Seeding & Test Data

Add a simple seed script to create sample users, profiles, and campaigns.

*server/src/scripts/seed.js*

```js
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Campaign } from '../models/Campaign.js';

(async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({});
  await Campaign.deleteMany({});

  const brand = await User.create({ email: 'brand@demo.com', password: 'Password@123', role: 'brand' });
  const creator = await User.create({ email: 'creator@demo.com', password: 'Password@123', role: 'creator' });

  await Campaign.create({
    title: 'Summer Launch UGC',
    brand: brand._id,
    budget: 10000,
    deliverables: ['1 IG Reel', '2 Stories'],
    niche: ['fashion'],
    platforms: ['instagram'],
  });

  console.log('Seeded demo data.');
  process.exit(0);
})();
```

Run:

```bash
node src/scripts/seed.js
```

---

## 🔌 API Overview

**Auth**

* `POST /api/auth/register` – email/password signup (role: creator | brand)
* `POST /api/auth/login` – returns access + refresh tokens
* `POST /api/auth/refresh` – rotate tokens
* `POST /api/auth/logout`

**Profiles**

* `GET /api/profiles/me`
* `PUT /api/profiles/me`
* `GET /api/creators` – query by niche, platform, audience
* `GET /api/brands` – discover brands

**Campaigns**

* `POST /api/campaigns` (brand)
* `GET /api/campaigns` (search + filters)
* `GET /api/campaigns/:id`
* `POST /api/campaigns/:id/apply` (creator)
* `PATCH /api/applications/:id` – accept/reject, set milestones, status updates

**Messaging**

* `GET /api/messages/:threadId`
* `POST /api/messages/:threadId`

**Reviews**

* `POST /api/reviews` – mutual feedback after completion

> All protected routes require `Authorization: Bearer <token>`.

---

## 🖥️ UI Highlights (suggested)

* Creator dashboard: applications, deadlines, payments
* Brand dashboard: pipeline (new → shortlisted → in-progress → done)
* Campaign card components with tags for niche/platform/budget
* Responsive layout with Tailwind + Headless UI

> Add screenshots/GIFs here when ready: `/docs/screenshots/...`

---

## 🛡️ Security & Best Practices

* Rate limiting and CORS
* Helmet headers on API
* Strong password policy + bcrypt hashing
* Refresh token rotation & revocation list
* Validate all inputs with Zod/Yup/Joi
* Principle of least privilege in controllers

---

## 🧪 Testing

* **Client:** Vitest + React Testing Library
* **Server:** Jest + Supertest (HTTP tests)

```bash
# in client
npm run test

# in server
npm run test
```

---

## 🐳 Docker (optional)

`docker-compose.yml`

```yaml
version: '3.9'
services:
  api:
    build: ./server
    ports:
      - '5000:5000'
    env_file: server/.env
    depends_on:
      - mongo
  web:
    build: ./client
    ports:
      - '5173:80'
    environment:
      - VITE_API_URL=http://localhost:5000/api
  mongo:
    image: mongo:6
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db
volumes:
  mongo_data:
```

```bash
docker compose up --build
```

---

## ☁️ Deployment

* **Frontend:** Vercel/Netlify
* **Backend:** Render/Railway/Fly.io
* **DB:** MongoDB Atlas

Set env variables in each platform as per `.env`.

---

## 📜 Scripts & Conventions

* Commit style: Conventional Commits (`feat:`, `fix:`, `chore:` …)
* Format on commit: Husky + lint-staged
* Path aliases (optional) for clean imports

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/awesome`
3. Commit changes: `git commit -m "feat: add awesome"`
4. Push: `git push origin feat/awesome`
5. Open a PR

See `CODE_OF_CONDUCT.md` and `CONTRIBUTING.md` (add these files soon).

---

## 🗺️ Roadmap

* [ ] Creator & brand onboarding flows
* [ ] Campaign brief templates
* [ ] Matching score & recommendations
* [ ] Payments integration (Stripe/PayPal)
* [ ] Analytics dashboard
* [ ] Notifications (email + in-app)
* [ ] i18n and timezone support

---

## 📄 License

MIT © 2025 Parag Sharma

---

## 📬 Contact

**Parag Sharma** – GDSC MMDU | GDG on Campus Organizer
Email: *add your email here*
Twitter/LinkedIn/GitHub: *add links*

> If you build something cool with Linkfluence, share it and tag me! 🚀
