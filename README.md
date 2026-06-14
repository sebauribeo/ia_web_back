# Backend — AI Platform API

NestJS 11 modular monolith with PostgreSQL, JWT auth, and Swagger docs.

```
API → http://localhost:3000/api
Docs → http://localhost:3000/api/docs
```

---

## Modules

### Auth
JWT login/register via Passport (Local + JWT strategies).
- `POST /api/auth/login` — email + password → JWT
- `POST /api/auth/register` — create account → JWT

### Users
User CRUD with roles (`client` | `admin`).
- `GET /api/users` — list all
- `GET /api/users/:id` — get by UUID
- `PUT /api/users/:id` — update (JWT)
- `DELETE /api/users/:id` — delete (JWT)

### Services
Service catalog (Chatbots, Automation, Autonomous Agents).
- `GET /api/services` — list sorted by sortOrder
- `GET /api/services/:id` — get by UUID
- `POST /api/services` — create (JWT)
- `PUT /api/services/:id` — update (JWT)
- `DELETE /api/services/:id` — delete (JWT)

### Cases
Success stories / case studies.
- `GET /api/cases` — list published (newest first)
- `GET /api/cases/:id` — get by UUID
- `POST /api/cases` — create (JWT)
- `PUT /api/cases/:id` — update (JWT)
- `DELETE /api/cases/:id` — delete (JWT)

### Contacts
Contact form submissions (contact | quote | evaluation).
- `POST /api/contacts` — submit form (public)
- `GET /api/contacts` — list all (JWT)
- `GET /api/contacts/:id` — get by ID (JWT)
- `PATCH /api/contacts/:id/read` — mark as read (JWT)
- `DELETE /api/contacts/:id` — delete (JWT)

### Chat
**Agent A1** — Floating widget chatbot.
- `POST /api/chat/message` — process message (public)
- `GET /api/chat/history` — get session history

### Demo
**Agent A2** — Interactive demo.
- `POST /api/demo/message` — process message (public)

### Calendar
Meeting scheduling (mock → Calendly/Cal.com).
- `GET /api/calendar/slots?date=` — available slots
- `POST /api/calendar/book` — create booking

### Health
- `GET /api/health` — service status

---

## Tech Stack

| Dependency | Version | Purpose |
|------------|---------|---------|
| @nestjs/core | 11 | Framework |
| @nestjs/typeorm | 11 | ORM |
| @nestjs/jwt | 11 | JWT signing/verification |
| @nestjs/passport | 11 | Auth strategies |
| @nestjs/swagger | 11 | API docs |
| typeorm | 1 | Database ORM |
| pg | 8 | PostgreSQL driver |
| bcrypt | 6 | Password hashing |
| passport-jwt | 4 | JWT strategy |
| passport-local | 1 | Local strategy |

---

## Database

PostgreSQL 16 with 5 tables: `users`, `services`, `cases`, `contacts`, `chat_logs`.

See `SPEC.md` for full entity schemas.

---

## Seed Data

Run `src/database/seed.ts` to populate:
- 1 admin user
- 3 services
- 2 success stories

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Watch mode (dev) |
| `npm run build` | Compile to dist/ |
| `npm run start:prod` | Run compiled dist/main.js |
| `npm run lint` | ESLint |
| `npm test` | Jest |

---

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| DB_HOST | localhost | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_USERNAME | postgres | DB user |
| DB_PASSWORD | postgres | DB password |
| DB_DATABASE | ai_platform | DB name |
| JWT_SECRET | — | JWT signing secret |
| NODE_ENV | development | Environment |
