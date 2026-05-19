# 🚀 Smart Leads Dashboard

A full-stack lead management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) using TypeScript throughout.

## 📋 Features

### Authentication
- User registration and login with JWT
- Password hashing with bcrypt
- Protected routes with auth middleware
- Role-Based Access Control (Admin / Sales User)

### Lead Management
- Create, read, update, and delete leads
- Filter leads by status (New, Contacted, Qualified, Lost)
- Filter leads by source (Website, Instagram, Referral)
- Search leads by name or email (with debounced search)
- Sort leads by newest or oldest
- Backend pagination
- CSV export

### UI/UX
- Responsive design with TailwindCSS
- Loading and error states
- Empty states
- Form validation
- Clean, professional interface

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js, TypeScript, TailwindCSS |
| Backend    | Node.js, Express.js, TypeScript   |
| Database   | MongoDB, Mongoose                 |
| Auth       | JWT, bcrypt                       |
| DevOps     | Docker, Docker Compose            |

## 📁 Project Structure

```
smart-leads-dashboard/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page-level components
│       ├── hooks/          # Custom React hooks
│       ├── services/       # API service layer
│       ├── contexts/       # React context providers
│       ├── types/          # TypeScript interfaces
│       └── utils/          # Utility functions
├── server/                 # Express backend
│   └── src/
│       ├── config/         # Database and app config
│       ├── controllers/    # Request handlers
│       ├── middleware/     # Auth, error handling
│       ├── models/         # Mongoose schemas
│       ├── routes/         # API route definitions
│       ├── services/       # Business logic layer
│       ├── types/          # TypeScript interfaces
│       ├── utils/          # Utility functions
│       └── validators/     # Input validation schemas
└── docker-compose.yml      # Multi-container Docker setup
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-leads-dashboard
   ```

2. **Setup backend**
   ```bash
   cd server
   cp .env.example .env    # Configure your environment variables
   npm install
   npm run dev
   ```

3. **Setup frontend**
   ```bash
   cd client
   cp .env.example .env    # Configure your environment variables
   npm install
   npm run dev
   ```

### Using Docker
```bash
docker-compose up --build
```

## 🔑 Environment Variables

See `.env.example` files in both `client/` and `server/` directories.

## 📡 API Documentation

See [API_DOCS.md](./API_DOCS.md) for full API documentation.

## 📄 License

This project is part of an internship assignment.
