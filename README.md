# 🌌 GemSpace

A full-stack social posting platform where users can share thoughts, follow each other, and interact with posts — built with the MERN stack and deployed live.

🔗 **Live:** [gemspace.gemplus.dpdns.org](https://gemspace.gemplus.dpdns.org)

---

## ✨ Features

**Auth & Accounts**
- Register / Login with email & password (bcrypt hashed)
- Google OAuth login via Passport.js
- JWT stored in httpOnly cookies (secure, XSS-resistant)
- Profile picture upload via Cloudinary
- Edit profile details

**Posts**
- Create, edit, and delete posts
- Like / unlike posts with live like count
- Paginated home feed
- View your own posts on your profile page

**Social**
- Follow / unfollow other users
- Following feed — see posts from people you follow

**Security**
- API hardened with `helmet` (HTTP headers)
- `express-mongo-sanitize` to prevent NoSQL injection
- Rate limiting on auth routes to prevent brute force
- Cookie-based auth with domain-scoped settings in production

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt, Passport.js (Google OAuth) |
| File Storage | Cloudinary (profile pictures) |
| Deployment | Frontend on Vercel, Backend on Render |

---

## 🗂️ Project Structure

```
├── client/
│   └── src/
│       ├── components/     # Navbar, Sidebar, Posts, ProfilePost
│       ├── pages/          # Home, Profile, Auth, Edit, Following, ProfilePic
│       └── App.jsx
└── server/
    └── src/
        ├── config/         # MongoDB, Cloudinary setup
        ├── middleware/      # Auth (JWT verify), Rate limiter
        ├── models/         # User, Post (Mongoose schemas)
        ├── routes/         # Auth routes, Post routes
        └── services/       # authService, postService (business logic)
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account
- Google OAuth credentials

### 1. Clone the repo
```bash
git clone https://github.com/gem-plus/Simple-Text-Base-Application
cd Simple-Text-Base-Application
```

### 2. Setup the server
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the server:
```bash
nodemon app.js
```

### 3. Setup the client
```bash
cd "client/Simple Text Base Application"
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## 📸 API Overview

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login with email/password |
| GET | `/auth/google` | Google OAuth login |
| GET | `/logout` | Clear auth cookie |
| GET | `/profile` | Get current user profile |
| POST | `/profilepic` | Upload profile picture |
| GET | `/` | Paginated home feed |
| POST | `/post` | Create a new post |
| POST | `/like/:id` | Like / unlike a post |
| POST | `/delete/:postid` | Delete a post |
| POST | `/following` | Follow / unfollow a user |

---

## 📄 License

MIT License — feel free to use, fork, and build on this.
