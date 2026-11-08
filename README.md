# OFFSET. — Content Creator Management & Viewer Engagement

OFFSET is an editorial-style creator platform with a public viewer portal and a private creator studio. It is built for the Web Design II practical using React, Node.js, Express, MongoDB/Mongoose, JWT authentication and responsive CSS.

## Features

### Public viewer portal
- Editorial home page, featured story and responsive content library
- Search and category filters
- Story detail pages with media links, view counts and article content
- Like/unlike using a browser visitor key
- Viewer comments with display names; comments are held for creator approval
- Copy story link to share

### Private creator studio
- JWT-protected creator login
- Overview statistics: total stories, published, drafts, reads, comments and likes
- Create, edit, delete, publish and draft content
- Schedule content for a future date/time
- Comment moderation: approve, hide and delete
- Publishing plan showing scheduled and published content

### Security and persistence
- Passwords are hashed with bcrypt before storage
- JWT-protected management endpoints
- Helmet security headers, CORS, request-size limit and API rate limiting
- MongoDB collections/models: users, contents, comments and likes
- Environment variables for database credentials, JWT secret and allowed client origin

## Project structure

```text
offset-creator-platform/
  client/       React + Vite frontend
  server/       Express API + Mongoose models
  README.md
  package.json
```

## Run locally

Requirements: Node.js 20+ and an accessible MongoDB database (MongoDB Atlas is recommended).

1. Create a MongoDB Atlas cluster and database user. Allow your development IP in Network Access.
2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`, a long random `JWT_SECRET`, and the creator login details.
3. Copy `client/.env.example` to `client/.env` (the default local API URL is already correct).
4. From the project root run:

```bash
npm install
npm run install:all
npm run seed --prefix server
npm run dev
```

5. Open `http://localhost:5173` for the public portal. The API runs at `http://localhost:5000`.
6. Sign in at `/studio/login` using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from `server/.env`.

The seed command creates the creator account and a small set of sample stories if the content collection is empty. Change the default password before using a public deployment.

## API overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Creator login |
| GET | `/api/auth/me` | Creator | Current creator |
| GET | `/api/contents` | Public | Published content, search and category filters |
| GET | `/api/contents/:id` | Public | Story detail and view increment |
| POST | `/api/contents` | Creator | Create content |
| GET | `/api/contents/manage/all` | Creator | All content for studio |
| PUT | `/api/contents/:id` | Creator | Update content |
| DELETE | `/api/contents/:id` | Creator | Delete content and related engagement |
| POST | `/api/contents/:id/like` | Public | Toggle a like |
| POST | `/api/comments` | Public | Submit a comment for moderation |
| GET | `/api/comments/:contentId` | Public | Approved comments for a story |
| GET | `/api/comments/manage/all` | Creator | All comments |
| PATCH | `/api/comments/:id/status` | Creator | Approve, hide or return to pending |
| DELETE | `/api/comments/:id` | Creator | Delete comment |
| GET | `/api/dashboard/stats` | Creator | Dashboard metrics |

## Deployment plan

### MongoDB Atlas
- Create a production database and database user.
- Add the backend host to Network Access (for Render, configure access appropriately; do not expose database credentials in frontend code).
- Copy the Atlas connection string into Render as `MONGODB_URI`.

### Backend on Render
- Create a new Web Service connected to the GitHub repository.
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Add `MONGODB_URI`, `JWT_SECRET`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CLIENT_URL` as Render environment variables.
- After the first deploy, run the seed command once from the Render shell: `npm run seed`.

### Frontend on Vercel
- Import the same GitHub repository into Vercel.
- Root directory: `client`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL` with the deployed Render API URL ending in `/api`.
- Add a `client/vercel.json` rewrite (included) so React Router paths load correctly.
- Update Render's `CLIENT_URL` to the deployed Vercel URL and redeploy the backend.

## Important notes before submission
- Replace the sample creator profile/content with your own original identity, writing and images.
- The app stores thumbnail/media URLs; it does not upload media files to cloud storage. The practical allows a media link, and image upload is an optional extension.
- Likes use a browser-generated visitor key rather than full viewer accounts. This keeps the viewer flow simple; it is not strong identity verification.
- Scheduled stories are stored and displayed in the publishing plan. For production-grade automatic publishing, add a scheduled worker/cron process to change due stories from `Scheduled` to `Published`.
- Add your actual GitHub repository and deployed URLs to your final submission after hosting.
