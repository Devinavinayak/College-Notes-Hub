<<<<<<< HEAD
Your local README content

# College Notes Hub — Full Stack Development Mini Project

A complete college notes sharing platform built with **React + Spring Boot + MySQL**.

## Covered requirements

- Faculty registration and login
- Student registration and login
- Role-based dashboards
- Faculty profile with department/designation
- Student profile with branch/year/semester/section
- Faculty can create the subjects they teach
- Faculty can upload PDF and image notes
- Notes are stored on the server; metadata is stored in MySQL
- Subject/unit organization
- Student faculty directory
- Student access request automatically uses the student's registered academic details
- Faculty sees the student's academic details before approving
- Faculty can accept/reject requests
- Students only see notes belonging to faculties/subjects for which access was accepted
- Search notes and subjects
- View/download protected notes
- Faculty can view/delete their uploaded notes
- Passwords are BCrypt-hashed
- JWT authentication
- CORS configuration for the React frontend
- 25 MB file upload limit
- No demo accounts or sample data are seeded; create accounts and content in the app

## Architecture

React frontend → REST API → Spring Boot → Spring Data JPA → MySQL
                                      ↘ local file storage (`backend/uploads`)

MySQL stores users, subjects, note metadata and access requests. The actual PDFs/images are stored as files, while the database stores their filenames, type, size, subject, faculty and timestamps.

## Requirements

- Java 21+
- MySQL 8+
- Node.js 20+
- npm

## 1. Create/start MySQL

The backend can create the database automatically if the MySQL user has permission. You can also create it manually:

```sql
CREATE DATABASE college_notes;
```

Default connection in `backend/src/main/resources/application.properties`:

```text
DB_URL=jdbc:mysql://localhost:3306/college_notes?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata
DB_USERNAME=root
DB_PASSWORD=root
```

Change `DB_PASSWORD` to your MySQL password.

## 2. Start the backend

Open a terminal in `backend`.

If Maven is installed:

```bash
mvn spring-boot:run
```

Or build and run:

```bash
mvn clean package
java -jar target/college-notes-backend-1.0.0.jar
```

The API runs at:

```text
http://localhost:8080
```

Uploaded files are stored in:

```text
backend/uploads/
```

You can change this with `UPLOAD_DIR`.

## 3. Start the frontend

Open another terminal in `frontend`:

```bash
npm install
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

## First-time setup

After starting the app, register a faculty account and a student account. The faculty can add subjects and upload notes; the student can request access to a subject, and the faculty can approve or reject that request.

## Environment variables

Backend supports:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
JWT_EXPIRATION_MS
UPLOAD_DIR
FRONTEND_URL
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_VERIFY_SERVICE_SID
```

For production, use a long random `JWT_SECRET`, a non-root database account, HTTPS, cloud/object storage, and regular backups.

## SMS password reset

Password reset uses Twilio Verify. Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_VERIFY_SERVICE_SID` in the backend process environment, then restart the backend. Never commit these values or paste them into chat. Each account's saved phone number must be in E.164 format (for example, `+919876543210`) and able to receive SMS. The reset screen sends a code to the account's saved number and updates the password only after Twilio approves the code.

## Important production improvements

This is a college mini-project foundation. For production deployment, add:

- HTTPS
- Cloud/object storage such as S3/Azure Blob/GCS
- Database backups and disaster recovery
- Email verification/password reset
- Rate limiting
- Antivirus/file scanning
- Audit logging
- Pagination for large note collections
- Admin moderation
- Stronger validation and file-size/type checks
- Separate production secrets

## API summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### User

- `GET /api/users/me`
- `GET /api/users/faculty`

### Subjects

- `GET /api/subjects`
- `GET /api/subjects/mine`
- `POST /api/subjects`

### Notes

- `GET /api/notes?q=...`
- `GET /api/notes/mine`
- `POST /api/notes/upload`
- `GET /api/notes/{id}/file`
- `DELETE /api/notes/{id}`

### Access requests

- `GET /api/requests`
- `POST /api/requests`
- `PUT /api/requests/{id}?status=ACCEPTED|REJECTED`
=======
# College-Notes-Hub
College Notes Hub is a web-based platform that simplifies academic resource sharing between faculty and students. Faculty can upload subject-wise notes and PDFs, manage multiple subjects, and approve or reject student access requests. Students can request, access, and download approved study materials through a centralized platform.
>>>>>>> 2ea2c305ff2cc655f811e734d0b77a980fdb10c6
README content from GitHub
>>>>>>> ...