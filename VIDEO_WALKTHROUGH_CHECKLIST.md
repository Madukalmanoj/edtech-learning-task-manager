# Video Walkthrough Checklist (5–10 min)

Use this as your recording script to demonstrate the full assignment.

1. **Project intro (30s)**
   - Mention stack (Node/Express/Mongo + React/Tailwind/ShadCN).
   - Highlight JWT auth, role-based rules, premium UI polish, and date filtering bonus.
2. **Environment + setup (45s)**
   - Show `.env` samples, describe `USE_IN_MEMORY_DB` helper, and run `npm run dev` (server) + `npm run dev` (client).
3. **Teacher signup/login (1 min)**
   - Use curl or UI to create teacher, log in, and point out dashboard layout (My Tasks / Student Tasks tabs).
4. **Student signup/login (1 min)**
   - Create student with teacher ID, log in to show restricted view (no student tab, only personal tasks).
5. **Task CRUD demo (2–3 min)**
   - Student creates a task via dialog -> watch list update instantly.
   - Update progress dropdown, highlight toast + re-fetch.
   - Delete task and show success toast.
6. **Teacher permissions (2 min)**
   - As teacher, create own task, switch between `My Tasks` and `Student Tasks`.
   - Attempt to edit/delete a student task (should be blocked by API, show toast/error response).
   - Discuss GET `/tasks` filtering logic referencing `taskController.buildTeacherTaskQuery`.
7. **Code tour (2 min)**
   - Highlight `middleware/auth.js`, `taskController.js`, `validators/`, and React `AuthContext` + `Dashboard` filtering.
   - Mention centralized error handler and validation hooks.
8. **Testing references (30s)**
   - Point to `server/docs/tests.md` and README test instructions.
9. **Wrap-up (30s)**
   - Summarize security (bcrypt/JWT), UX polish, and potential future enhancements.

