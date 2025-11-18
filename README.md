# EdTech Learning Task Manager

Full-stack take-home assignment implementing a premium SaaS-style experience for coordinating learning tasks between teachers and students.

## Tech Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose), Joi, JWT, bcrypt, express-rate-limit
- **Frontend**: React (Vite + TypeScript), TailwindCSS, ShadCN UI, Radix UI primitives, React Query, Axios
- **Tooling**: Nodemon, Sonner for toasts, Framer Motion for subtle animations

## Project Structure
```
.
├── server/   # Express API
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── docs/tests.md
│   └── server.js
├── client/   # React app
│   ├── src/components (layout, tasks, ShadCN UI primitives)
│   ├── src/pages (Login, Signup, Dashboard)
│   └── env.example
├── README.md
└── VIDEO_WALKTHROUGH_CHECKLIST.md
```

## Environment Variables

### Server (`server/env.example`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edtech_task_manager
JWT_SECRET=supersecurejwtsecret
CLIENT_ORIGIN=http://localhost:5173
# Optional helper for local development/testing without Mongo installed
USE_IN_MEMORY_DB=false
```

> Copy `server/env.example` to `server/.env` and adjust. Set `USE_IN_MEMORY_DB=true` to automatically boot an in-memory MongoDB instance for local smoke-tests.

### Client (`client/env.example`)
```
VITE_API_URL=http://localhost:5000
```
> Copy to `client/.env` (or `.env.local`) so the React app knows where to reach the API.

## Getting Started
1. **Install dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
2. **Start the API**
   ```bash
   cd server
   npm run dev
   ```
3. **Start the frontend**
   ```bash
   cd client
   npm run dev
   ```
4. Sign up a teacher, then a student tied to that teacher ID, and explore the dashboard at `http://localhost:5173`.

## API Overview

| Endpoint | Method | Description |
| --- | --- | --- |
| `/auth/signup` | POST | Registers a teacher or student (students must include a valid `teacherId`) |
| `/auth/login` | POST | Authenticates and returns `{ token, user }` |
| `/tasks` | GET | Students: only their tasks. Teachers: union of their own tasks *plus* tasks of assigned students (students where `teacherId === teacher._id`). Results include `ownership` metadata and populated creator info |
| `/tasks` | POST | Creates a task owned by the requester (JWT-derived `userId`) |
| `/tasks/:id` | PUT/DELETE | Owner-only updates/deletes enforced via middleware guard |

Responses consistently follow `{ success: boolean, message: string, data?: any }`. Validation uses Joi and centralized errors are returned via the global Express error handler.

### Role Rules Recap
- **Students**: must be tied to a teacher at signup and can only manage (CRUD) their own tasks.
- **Teachers**:
  - GET `/tasks`: see their own tasks **and** tasks created by their assigned students. Implementation uses `buildTeacherTaskQuery` inside `taskController` to merge both sets safely.
  - PUT/DELETE `/tasks/:id`: limited to tasks they personally created.

## Frontend Highlights
- Auth context stores JWT + user profile in `localStorage`, Axios interceptors auto-attach tokens and log out on `401`s.
- React Query powers all task fetching/mutations, giving instant UI refresh after mutations.
- Dashboard provides:
  - Student view: personal task list.
  - Teacher view: tabs for `My Tasks` and `Student Tasks`, with editing controls hidden for student-created tasks.
  - Date filters (All / Due this week / Overdue) and status filters (BONUS requirement satisfied).
  - ShadCN dialog for task creation/editing, toast notifications, skeleton loaders, and light/dark theming.

## Testing & QA
- Manual API scripts live in `server/docs/tests.md` (PowerShell-friendly `curl` commands for teacher/student signup, login, CRUD, and forbidden updates).
- Recommended flow:
  1. Start API/client dev servers.
  2. Execute the curl scripts in order to validate auth + task permissions.
  3. Use the UI to log in as both teacher and student to confirm role-based dashboards, optimistic updates, and filtering.

## Scripts
| Location | Command | Action |
| --- | --- | --- |
| server | `npm run dev` | Start Express API with Nodemon |
| server | `npm start` | Start API in production mode |
| client | `npm run dev` | Start Vite dev server (port 5173) |
| client | `npm run build` | Production build |

## Video Walkthrough
A ready-to-record outline covering signup/login flows, dashboards, CRUD demos, and code pointers is provided in `VIDEO_WALKTHROUGH_CHECKLIST.md`.

## AI Assistance Disclosure
AI pair-programming assisted with scaffolding, boilerplate generation, and narrative documentation. All business rules, role checks, data filtering, and UI behavior were implemented and manually verified before delivery.

## Future Enhancements
- Rich notification channels for overdue tasks.
- Public share links for teacher task packs.
- Calendar-based drag-and-drop planning.

