# Simple Text Base Application

A full-stack social posting app — register or sign in (including Google OAuth), write text posts, like other users' posts, and edit your own. Built as a MERN-style app with a React/Vite client and an Express/MongoDB API.

**Live demo:** [gemplus.dpdns.org](https://gemplus.dpdns.org/)

## Features

- User registration & login (email/password, hashed with `bcrypt`)
- Google OAuth login via Passport.js
- JWT-based auth stored in an `httpOnly` cookie
- Create, edit, and delete posts
- Like/unlike posts
- Profile page showing a user's own posts
- Paginated home feed
- Rate limiting on auth routes (`express-rate-limit`)
- Hardened with `helmet` and `express-mongo-sanitize` against common attacks

## Tech Stack

**Client**
- React 19 + Vite
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- React Router

**Server**
- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) for session tokens
- Passport.js (`passport-google-oauth20`) for Google sign-in
- `bcrypt` for password hashing
- `helmet`, `express-mongo-sanitize`, `express-rate-limit` for security

## Project Structure

```
Simple-Text-Base-Application/
├── client/
│   └── Simple Text Base Application/   # React app (Vite)
│       └── src/
│           ├── pages/                  # auth, home, profile, edit
│           └── components/             # post components, shadcn ui
└── server/
    ├── app.js                          # Express app entry point
    └── src/
        ├── routes/                     # auth.js, post.js
        ├── services/                  # business logic
        ├── models/                    # User, Post (Mongoose)
        └── middleware/                # JWT auth guard, rate limiter
```

## API Overview

| Method | Route | Description |
|---|---|---|
| `POST` | `/register` | Create a new user |
| `POST` | `/login` | Log in, sets JWT cookie |
| `GET` | `/logout` | Clear auth cookie |
| `GET` | `/auth/google` | Start Google OAuth flow |
| `GET` | `/me` | Get current user ID (auth required) |
| `GET` | `/profile` | Get profile + user's posts (auth required) |
| `GET` | `/` | Get paginated post feed |
| `POST` | `/post` | Create a post (auth required) |
| `GET` | `/edit/:id` | Get a post for editing (auth required) |
| `POST` | `/update/:id` | Update a post (auth required) |
| `POST` | `/like/:id` | Like/unlike a post (auth required) |
| `POST` | `/delete/:postid` | Delete a post (auth required) |

## Getting Started

**Server**
```bash
cd server
npm install
# create a .env with: PORT, JWT_SECRET, SESSION_SECRET, MONGO_URI,
# CLIENT_URL, LOCAL_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CALLBACK_URL
npm run dev
```

**Client**
```bash
cd "client/Simple Text Base Application"
npm install
npm run dev
```

## Notes

This was built as a learning project covering full-stack auth (local + OAuth), REST API design, and a component-based React frontend. Contributions and suggestions welcome.
