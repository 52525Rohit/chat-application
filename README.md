# ChatSphere

A real-time 1-to-1 chat application built with React and Express, using Socket.IO for live messaging/presence and JWT (access + refresh tokens) for auth.

For a detailed running log of what's implemented, verified, and still missing, see [PROJECT_STATUS.md](./PROJECT_STATUS.md).

## Features

- **Auth** — register/login with bcrypt-hashed passwords, short-lived JWT access tokens (15m) silently renewed via a long-lived rotating refresh token (30d), rate-limited login/register, zod-validated inputs.
- **Messaging** — real-time text + image messages via Socket.IO, persisted in MySQL, cursor-based pagination with infinite scroll, read receipts, typing indicator, edit/soft-delete of your own messages.
- **Presence** — live online/offline status per user over Socket.IO.
- **Profile** — profile photo upload (multer), dedicated profile page.
- **UX** — desktop notifications + sound for new messages when the conversation isn't open, image attachment preview with remove button before sending, full-screen image lightbox with download.

## Tech Stack

**Frontend** — React 18, Vite, Tailwind CSS v4 + daisyUI, Zustand, React Router, Axios, Socket.IO client.

**Backend** — Node.js, Express 5, MySQL (`mysql2`), Socket.IO, JWT (`jsonwebtoken`), bcrypt, zod, multer, express-rate-limit.

## Project Structure

```
chat-application/
├── backend/
│   ├── schema.sql                 # DB schema (employees, messages, refresh_tokens)
│   └── src/
│       ├── config/                # MySQL pool
│       ├── controllers/           # auth, user, message
│       ├── middlewares/           # authMiddleware, upload, rateLimiter, validate, errorHandler
│       ├── models/                # User, Message, RefreshToken
│       ├── routes/                # authRoutes, userRoutes, messageRoutes
│       ├── scripts/migrate.js     # idempotent DB migration
│       ├── sockets/socketServer.js
│       ├── validations/           # zod schemas
│       └── uploads/               # uploaded images (gitignored content, dir tracked)
└── frontend/
    └── src/
        ├── api/                   # axiosClient (token refresh interceptor), authApi, userApi, messageApi
        ├── context/               # AuthProvider, SocketContext
        ├── features/
        │   ├── auth/              # Login, Register
        │   ├── chat/              # Sidebar, ChatWindow, MessageList/Bubble/Input, ...
        │   └── profile/           # ProfileBadge, ProfileDetailsPage
        ├── hooks/                 # useMessages, useSocketMessages, useGetAllUsers, ...
        ├── store/                 # useConversationStore (zustand)
        └── utils/                 # authStorage (token/session helpers)
```

## Getting Started

### Prerequisites

- Node.js 18+
- A running MySQL server

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in `backend/.env` with your MySQL credentials and a strong `JWT_SECRET` (e.g. `openssl rand -hex 32`). The frontend `.env` only needs `VITE_API_URL` if your backend isn't on `http://localhost:5000/api`.

### 3. Set up the database

Run `backend/schema.sql` against your MySQL server to create the database and tables:

```bash
mysql -u root -p < backend/schema.sql
```

If you already have an older version of the DB (missing `refresh_tokens`, `is_edited`, `is_deleted`), run the idempotent migration instead:

```bash
cd backend && npm run migrate
```

### 4. Run the app

```bash
# backend (http://localhost:5000)
cd backend && npm run dev

# frontend (http://localhost:5173)
cd frontend && npm run dev
```

## Available Scripts

**backend**
- `npm run dev` / `npm start` — run the API with nodemon
- `npm run migrate` — apply any pending schema changes to an existing DB

**frontend**
- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | rate-limited | Register a new user (optional profile photo) |
| POST | `/api/auth/login` | rate-limited | Log in, returns access + refresh tokens |
| POST | `/api/auth/refresh` | — | Rotate a refresh token for a new access token |
| POST | `/api/auth/logout` | — | Revoke a refresh token |
| GET | `/api/users/allUser` | JWT | List all registered users |
| POST | `/api/users/updateProfile` | JWT | Update your profile photo |
| GET | `/api/messages/:receiverId` | JWT | Paginated conversation history (`?limit=&before=`), marks it as read |
| POST | `/api/messages` | JWT | Send a text and/or image message |
| PATCH | `/api/messages/:messageId` | JWT | Edit your own message |
| DELETE | `/api/messages/:messageId` | JWT | Soft-delete your own message |

Real-time events over Socket.IO (authenticated via the JWT in the handshake): `getOnlineUsers`, `newMessage`, `messagesRead`, `messageEdited`, `messageDeleted`, `typing`, `stopTyping`.

## Known Limitations

No forgot-password flow, no email verification, no group chat, no message search, and a few dev/ops gaps (no automated tests, no CI/CD). See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for the full, up-to-date list.
