Emergency Legacy Backend (Spring Boot)

This is the backend service for the Emergency Legacy Information system. It provides RESTful APIs for user authentication, user profile, and CRUD for legacy items (assets, accounts, messages, etc.).

Tech stack
- Java 17
- Spring Boot 3 (Web, Security, Data JPA, Validation, Mail, Scheduling)
- JWT (jjwt)
- MySQL
- OpenAPI/Swagger UI
- Spring @Scheduled (lightweight task scheduler)

Run locally
1) Prepare MySQL
- Create database: legacydb
- Or run with Docker:
  docker run --name legacy-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=legacydb -p 3306:3306 -d mysql:8

2) Configure environment (optional)
- Set environment variables if needed:
  - DB_URL (default jdbc:mysql://localhost:3306/legacydb?useSSL=false&serverTimezone=UTC)
  - DB_USERNAME (default root)
  - DB_PASSWORD (default password)
  - JWT_SECRET (default change-this-secret-please-change-to-a-long-random-string)
  - CORS_ALLOWED_ORIGINS (default http://localhost:5173)
  - EMAIL_ENABLED (default false, set to true to enable email notifications)
  - MAIL_HOST (default smtp.gmail.com)
  - MAIL_PORT (default 587)
  - MAIL_USERNAME (your email address)
  - MAIL_PASSWORD (your email password or app-specific password)
  - INACTIVITY_CHECK_CRON (default 0 0 2 * * ?, runs daily at 2 AM)

3) Build & Run
- In this folder: mvn spring-boot:run
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- Health check: http://localhost:8080/actuator/health

Database schema
- Tables are created automatically by JPA (ddl-auto=update).
- Entities:
  - users(id, username unique, email unique, password, roles, created_at, updated_at, last_login_at, emergency_email, inactivity_days, legacy_sent)
  - legacy_items(id, user_id FK, category, title, content, created_at, updated_at)

API summary
- Auth
  - POST /api/auth/register {username,email,password} -> 200
  - POST /api/auth/login {identifier,password} -> {token,user}
- User
  - GET /api/user/me (auth) -> user
  - PUT /api/user/update (auth) -> user
  - GET /api/user/emergency-settings (auth) -> {emergencyEmail, inactivityDays, lastLoginAt}
  - PUT /api/user/emergency-settings (auth) {emergencyEmail, inactivityDays} -> success message
- Legacy
  - GET /api/legacy (auth) -> list
  - POST /api/legacy (auth) -> item
  - GET /api/legacy/{id} (auth) -> item
  - PUT /api/legacy/{id} (auth) -> item
  - DELETE /api/legacy/{id} (auth) -> 204

Scheduled Tasks
- InactivityCheckScheduler: Runs daily (default 2 AM) to check if users have been inactive beyond their configured threshold
- If a user hasn't logged in for N days (configured via inactivity_days):
  - Sends all their legacy items to the emergency contact email
  - Marks legacy_sent=true to prevent duplicate sends
  - Resets when user logs in again

Notes
- Passwords are stored using BCrypt.
- JWT Bearer tokens are required on all non-auth endpoints.
- Allowed origins for CORS can be configured via CORS_ALLOWED_ORIGINS.
- Email functionality is disabled by default. Set EMAIL_ENABLED=true to activate.
