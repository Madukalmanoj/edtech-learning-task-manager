$ErrorActionPreference = 'Stop'

$headers = @{ 'Content-Type' = 'application/json' }
$timestamp = Get-Date -Format 'yyyyMMddHHmmss'
$teacherEmail = "teacher+$timestamp@example.com"
$studentEmail = "student+$timestamp@example.com"

$teacherBody = @{
    email    = $teacherEmail
    password = 'SecurePass123!'
    role     = 'teacher'
} | ConvertTo-Json

$teacherSignup = Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/auth/signup' -Headers $headers -Body $teacherBody

$studentBody = @{
    email     = $studentEmail
    password  = 'SecurePass123!'
    role      = 'student'
    teacherId = $teacherSignup.user.id
} | ConvertTo-Json

$studentSignup = Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/auth/signup' -Headers $headers -Body $studentBody

$teacherLogin = Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/auth/login' -Headers $headers -Body (@{
        email    = $teacherEmail
        password = 'SecurePass123!'
    } | ConvertTo-Json)

$studentLogin = Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/auth/login' -Headers $headers -Body (@{
        email    = $studentEmail
        password = 'SecurePass123!'
    } | ConvertTo-Json)

$studentHeaders = @{
    'Content-Type' = 'application/json'
    Authorization  = "Bearer $($studentLogin.token)"
}

$taskBody = @{
    title       = 'Read Chapter 1'
    description = 'Limits intro'
    dueDate     = (Get-Date).AddDays(7).ToString('o')
    progress    = 'not-started'
} | ConvertTo-Json

$studentTask = Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/tasks' -Headers $studentHeaders -Body $taskBody
$studentTasks = Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/tasks' -Headers $studentHeaders

$teacherHeaders = @{ Authorization = "Bearer $($teacherLogin.token)" }
$teacherTasks = Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/tasks' -Headers $teacherHeaders

try {
    $forbidden = Invoke-RestMethod -Method Put -Uri ("http://localhost:5000/tasks/" + $studentTask.data._id) -Headers $teacherHeaders -Body (@{ progress = 'completed' } | ConvertTo-Json) -ContentType 'application/json'
} catch {
    $forbidden = $_.ErrorDetails.Message | ConvertFrom-Json
}

$log = [PSCustomObject]@{
    teacherSignup   = $teacherSignup
    studentSignup   = $studentSignup
    teacherLogin    = @{ user = $teacherLogin.user; token = 'stored' }
    studentLogin    = @{ user = $studentLogin.user; token = 'stored' }
    studentTask     = $studentTask
    studentTasks    = $studentTasks
    teacherTasks    = $teacherTasks
    forbiddenUpdate = $forbidden
}

$log | ConvertTo-Json -Depth 6 | Set-Content (Join-Path (Join-Path $PSScriptRoot '..') 'TEST_LOG.json')

$log

