# API Manual Test Scripts

Replace the placeholder IDs/tokens with values from your environment.

```bash
# 1. Signup teacher
curl -X POST http://localhost:5000/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"teacher@example.com\",\"password\":\"SecurePass123\",\"role\":\"teacher\"}"

# 2. Signup student (replace TEACHER_ID with response from step 1)
curl -X POST http://localhost:5000/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"student@example.com\",\"password\":\"SecurePass123\",\"role\":\"student\",\"teacherId\":\"TEACHER_ID\"}"

# 3. Login teacher
curl -X POST http://localhost:5000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"teacher@example.com\",\"password\":\"SecurePass123\"}"

# 4. Login student
curl -X POST http://localhost:5000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"student@example.com\",\"password\":\"SecurePass123\"}"

# 5. Student creates a task (replace STUDENT_TOKEN with step 4 token)
curl -X POST http://localhost:5000/tasks ^
  -H "Authorization: Bearer STUDENT_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Read Chapter 1\",\"description\":\"Intro to Calculus\",\"dueDate\":\"2025-11-30T17:00:00.000Z\",\"progress\":\"not-started\"}"

# 6. Student fetches own tasks
curl http://localhost:5000/tasks ^
  -H "Authorization: Bearer STUDENT_TOKEN"

# 7. Teacher fetches teacher + student tasks (replace TEACHER_TOKEN)
curl http://localhost:5000/tasks ^
  -H "Authorization: Bearer TEACHER_TOKEN"

# 8. Teacher attempts forbidden update on student task (should return 403)
curl -X PUT http://localhost:5000/tasks/TASK_ID ^
  -H "Authorization: Bearer TEACHER_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"progress\":\"completed\"}"
```

