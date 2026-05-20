# Smart Leads Dashboard

A full-stack **lead management CRM** built with the MERN stack and TypeScript. Manage sales leads with authentication, role-based access, filtering, pagination, CSV export, and a dashboard analytics overview.

> Built as a portfolio / internship assignment project — production-minded structure, beginner-friendly code, and Docker-ready setup.

---

## Features

### Authentication & Security
- User registration and login with JWT
- Password hashing with bcrypt
- Protected API routes and React routes
- Role-based access control (**Admin** / **Sales**)

### Lead Management
- Full CRUD for leads
- Filter by status (New, Contacted, Qualified, Lost)
- Filter by source (Website, Instagram, Referral)
- Debounced search by name or email
- Sort by newest / oldest
- Backend pagination
- CSV export (respects active filters)

### Dashboard
- Overview stat cards (total, new, contacted, qualified, lost)
- Recent leads list
- Leads by source summary
- Pipeline activity snapshot

### UI / UX
- Responsive layout (mobile cards + desktop table)
- Loading skeletons, spinners, and empty states
- Form validation with Zod + React Hook Form
- Toast notifications
- Accessible modals (keyboard + focus-friendly patterns)

---

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Axios, React Hook Form, Zod |
| **Backend** | Node.js, Express 5, TypeScript, Mongoose |
| **Database** | MongoDB |
| **Auth** | JWT, bcrypt |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## Project Structure

```
smart-leads-dashboard/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # UI, leads, dashboard, modals
│   │   ├── contexts/            # AuthContext
│   │   ├── hooks/               # useDebounce, useModalLock
│   │   ├── layouts/             # DashboardLayout (sidebar shell)
│   │   ├── pages/               # Route-level pages
│   │   ├── routes/              # ProtectedRoute, GuestRoute
│   │   ├── services/            # API layer (axios)
│   │   ├── types/               # TypeScript interfaces
│   │   └── utils/               # Helpers, validations
│   ├── Dockerfile               # Build + Nginx production image
│   └── nginx.conf               # Proxies /api → backend
├── server/                      # Express API
│   └── src/
│       ├── config/              # env, database
│       ├── controllers/         # Route handlers
│       ├── middleware/          # Auth, errors, RBAC
│       ├── models/              # Mongoose schemas
│       ├── routes/              # API routes
│       ├── types/               # Shared TS types
│       ├── utils/               # JWT, CSV export
│       └── validators/          # express-validator
├── docker-compose.yml           # Mongo + API + frontend
├── .env.example                 # Docker Compose variables
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ (20 recommended)
- **npm**
- **MongoDB** (local install or MongoDB Atlas)
- **Docker Desktop** (optional, for containerized setup)

---

## Environment Setup

### Backend (`server/.env`)

```bash
cd server
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing tokens (required) |
| `JWT_EXPIRES_IN` | Token expiry (default `7d`) |
| `CLIENT_URL` | Frontend URL for CORS (default `http://localhost:5173`) |

### Frontend (`client/.env`)

```bash
cd client
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL (`/api` uses Vite proxy in dev) |

### Docker (project root `.env`)

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Required — set a strong random value |
| `JWT_EXPIRES_IN` | Optional (default `7d`) |
| `CLIENT_URL` | Browser URL for CORS (default `http://localhost:3000`) |

---

## Running Locally (without Docker)

### 1. Start MongoDB

Use a local MongoDB instance or MongoDB Atlas. Update `MONGODB_URI` in `server/.env`.

### 2. Start the backend

```bash
cd server
npm install
npm run dev
```

API: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

### 3. Start the frontend

```bash
cd client
npm install
npm run dev
```

App: `http://localhost:5173`

The Vite dev server proxies `/api` requests to the backend automatically.

### 4. Create your first user

1. Open `http://localhost:5173/register`
2. Register as **Admin** or **Sales**
3. Log in and start managing leads

---

## Docker Setup

Docker runs **three containers** that work together:

| Container | Image | Port (host) | Role |
|-----------|-------|-------------|------|
| `mongo` | MongoDB 7 | 27017 | Database |
| `backend` | Custom Node build | 5000 | REST API |
| `frontend` | Nginx + React build | 3000 | Web UI + API proxy |

### Quick start

```bash
# From project root
cp .env.example .env
# Edit .env and set JWT_SECRET to a secure value

docker compose up --build
```

Open **`http://localhost:3000`** in your browser.

### How containers communicate

```
Browser → localhost:3000 (frontend/nginx)
              │
              ├─ /          → React static files
              └─ /api/*     → proxy → backend:5000
                                    │
                                    └─ mongo:27017
```

- The **browser** only talks to port `3000`.
- Nginx forwards `/api` to the `backend` service on the Docker network.
- The **backend** connects to `mongo` using the hostname `mongo` (Docker DNS).

### Useful Docker commands

```bash
docker compose up --build      # Build and start
docker compose down            # Stop containers
docker compose down -v           # Stop and remove database volume
docker compose logs -f backend   # View API logs
```

---

## API Overview

Base URL (local dev): `http://localhost:5000/api`  
Base URL (Docker): `http://localhost:3000/api` (via Nginx proxy)

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register user |
| POST | `/auth/login` | No | Login, returns JWT |
| GET | `/auth/me` | Yes | Current user profile |

### Leads

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/leads` | Yes | List leads (filter, search, paginate) |
| GET | `/leads/stats` | Yes | Dashboard statistics |
| GET | `/leads/:id` | Yes | Single lead |
| POST | `/leads` | Yes | Create lead |
| PUT | `/leads/:id` | Yes | Update lead |
| DELETE | `/leads/:id` | Admin | Delete lead |
| GET | `/leads/export/csv` | Yes | Export CSV |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

**Query params for `GET /leads`:** `status`, `source`, `search`, `sort` (`latest` \| `oldest`), `page`, `limit`

**Authorization header:** `Bearer <jwt_token>`

---

## Screenshots

> Add screenshots here before submission for a polished portfolio README.

| Page | Screenshot |
|------|------------|
| Login | `docs/screenshots/login.png` |
| Dashboard | `docs/screenshots/dashboard.png` |
| Leads Table | `docs/screenshots/leads.png` |
| Mobile View | `docs/screenshots/mobile.png` |

---

## Assignment Notes

This project was built in phases:

1. Project setup & folder structure  
2. Backend API (Express + MongoDB)  
3. Authentication (JWT + RBAC)  
4. Lead CRUD & validation  
5. Filtering, search, pagination, CSV export  
6. React frontend & routing  
7. Leads UI (table, filters, modals)  
8. Dashboard analytics overview  
9. Docker + README + final polish  

**Design goals:** clean architecture, typed codebase, reusable components, and a setup that recruiters can run in minutes.

---

## Scripts Reference

### Server

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |

### Client

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

---

## Deployment Preparation

This repo is ready for deployment with minor configuration:

1. Set strong `JWT_SECRET` and production `MONGODB_URI` (e.g. MongoDB Atlas).
2. Set `CLIENT_URL` to your deployed frontend domain.
3. Build the client with `VITE_API_URL` pointing to your API (or use Nginx proxy like Docker).
4. Run the server with `NODE_ENV=production`.
5. Optionally deploy using the included `docker-compose.yml` on any VPS with Docker.

---

## License

This project is part of an internship / portfolio assignment.
