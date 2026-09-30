# ChatSphere — Project Status

Real-time 1-to-1 chat app. Frontend: React + Vite + Tailwind. Backend: Express + MySQL + Socket.IO. Auth: JWT.

Last updated: 2026-07-28 (security hardening + read receipts/typing/pagination/edit-delete added)

---

## 1. What's complete so far

### Authentication (JWT-based, with refresh tokens)
- Register — firstName, lastName, email, password, mobile + optional profile photo. Saved to the DB on the backend, password hashed with bcrypt. Validated server-side with zod (`backend/src/validations/authValidation.js`).
- Login — verifies email + password (zod-validated), issues a short-lived access token (`JWT_ACCESS_EXPIRES_IN`, default 15m) plus a long-lived opaque refresh token (`JWT_REFRESH_EXPIRES_DAYS`, default 30d), stored hashed (SHA-256) in the `refresh_tokens` table.
- `POST /api/auth/refresh` — rotates the refresh token (old one is revoked, a new pair is issued) and returns a fresh access token. `POST /api/auth/logout` revokes the given refresh token server-side.
- Login and register are rate-limited (`express-rate-limit`, 20 requests / 15 min / IP) to blunt brute-force attempts.
- Every sensitive backend route (`/api/users/allUser`, `/api/users/updateProfile`, `/api/messages/*`) is protected by JWT — the backend no longer trusts a client-supplied `sender_id`/`employee_id`; it derives the real identity from the verified token.
- The Socket.IO connection is also authenticated with the JWT (token sent in the handshake), so nobody can spoof another user's online status by passing a fake `userId` anymore.
- Logout — revokes the refresh token server-side, clears the token/session client-side, redirects to `/login`.
- Silent renewal — when an access token expires (401), an axios interceptor transparently calls `/auth/refresh`, retries the original request, and only forces a logout+redirect if the refresh token itself is invalid/expired/revoked.

### User Management
- List of all registered users (`GET /api/users/allUser`, protected).
- Real-time online/offline presence via Socket.IO.
- Profile picture upload — saved to disk via multer (`backend/src/uploads/`), filename stored in the `profile_pic` DB column, served back via `/api/uploads/...`.
- A dedicated page to view your own profile (`ProfileDetailsPage`).

### Messaging
- Real-time text messaging in both directions via Socket.IO (verified with a live 2-user test).
- Messages are persisted to the DB (`messages` table) — reloading the page re-fetches history via the REST API (`GET /api/messages/:receiverId`).
- Messages can include an image attachment. Sending is validated server-side with zod (`backend/src/validations/messageValidation.js`).
- On a new message: if that conversation is already open, it's appended instantly with a notification sound; otherwise, a browser notification + toast fires.
- **Pagination** — `GET /api/messages/:receiverId` is cursor-paginated (`?limit=&before=`, default 30/page). `MessageList` loads older messages when the user scrolls near the top, preserving scroll position.
- **Read receipts** — opening a conversation marks the other user's messages as read (`is_read` column) and emits a `messagesRead` socket event back to the sender; `MessageBubble` shows a single/double checkmark accordingly.
- **Typing indicator** — `MessageInput` emits debounced `typing`/`stopTyping` socket events; the backend relays them to the other participant; `ChatHeader` shows "typing...".
- **Edit/delete** — a sender can edit (`PATCH /api/messages/:messageId`) or soft-delete (`DELETE /api/messages/:messageId`) their own messages; both are ownership-checked server-side and synced to the other participant via `messageEdited`/`messageDeleted` socket events. Deleted messages render as "This message was deleted"; edited ones show an "edited" tag.

### Frontend Architecture
- Clean, professional folder structure:
  ```
  src/
    api/        axiosClient (token interceptor + silent refresh-on-401, falls back to auto-logout), authApi, userApi, messageApi
    features/
      auth/     Login, Register
      chat/     Sidebar, ConversationList/Item, SearchBar, LogoutButton,
                ChatWindow, ChatHeader, MessageList/Bubble/Input, NoChatSelected
      profile/  ProfileBadge, ProfileDetailsPage
    hooks/      useGetAllUsers, useMessages, useSocketMessages, useUpdateProfilePic
    store/      useConversationStore (zustand)
    context/    AuthProvider, SocketContext
    components/ Loading, Notifications (shared)
    pages/      HomePage
    utils/      authStorage (token/session helpers)
  ```
- Dead code, duplicate hooks, orphaned files, and commented-out blocks have been removed.
- Login/Register UI has been redesigned (dark themed, polished).

### Backend Architecture
- Consistent `routes -> controllers -> models` pattern throughout.
- `schema.sql` — `employees`, `messages`, and `refresh_tokens` tables, with foreign keys. `npm run migrate` (backend) applies schema changes idempotently to an existing DB.
- Centralized error-handling middleware (`notFound`, `errorHandler`).
- Reusable `upload.js` (multer) middleware — images only, 5MB limit, unique filenames; shared by both registration and profile-update.
- `authMiddleware.js` (`protect`) — guards every protected route.

## 2. Verified live
Browser/Playwright verification (photo upload, real-time messaging, auto-logout) was done in an earlier session — see git history. This round's additions (rate limiting, validation, refresh-token rotation, read receipts, typing, pagination, edit/delete) were verified with scripted end-to-end tests hitting the live backend over REST and Socket.IO (register/login/refresh/logout, ownership checks on edit/delete, cursor pagination, read-receipt and typing relays all passed). The frontend build (`npm run build`) and lint are clean, but the new UI itself has **not** been visually exercised in a real browser — no browser-automation tool was available in that session.

## 3. Known limitations / what's missing or risky right now

**Security/reliability:**
- No password reset / forgot password flow (deferred — needs an email provider decision).
- No email verification.
- No rate limiting on `/api/auth/refresh` or `/api/auth/logout` (only login/register are rate-limited).
- No pagination on the user list (`GET /api/users/allUser` still loads everyone).

**Features:**
- No group chat (1-to-1 only).
- No message search.

**Polish/UX:**
- Picking an image to attach overwrites the text input with the filename, making it awkward to add a caption.
- Mobile responsiveness is rough (heavy use of fixed `vh` units).
- Dark theme only, no light-mode toggle.

**Dev/ops:**
- No automated tests (unit or integration) at all.
- No CI-CD setup.
- The frontend `package.json` still lists several unused dependencies (confirmed — none are imported anywhere): `@reduxjs/toolkit`, `@react-pdf/image`, `fslightbox-react`, `js-cookie`, `prop-types`, `react-hook-form`, `react-modal-image`, `react-notifications`, `react-simple-image-viewer`, `react-toastify`, and the top-level `socket.io` (server package — the client only needs `socket.io-client`).

## 4. What could be added next (priority order)

**High priority — security/reliability:**
1. Forgot-password flow (email OTP or reset link) — deferred pending a decision on an email provider.
2. Rate-limit `/api/auth/refresh` and `/api/auth/logout` too.

**Nice to have:**
3. Group chat.
4. Message search.
5. Light/dark theme toggle.
6. Better mobile responsiveness.
7. Tests (Vitest/Jest + supertest).
8. CI/CD.
9. Clean up unused dependencies (to reduce bundle size).
10. Fix: picking an image attachment overwrites the text input with the filename instead of leaving room for a caption.
