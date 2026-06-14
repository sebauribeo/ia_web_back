# Backend — AI Platform API

NestJS 11 modular monolith with PostgreSQL, JWT auth (direct `jsonwebtoken.verify()`), and Swagger docs.  
Todo el código fuente comentado en español con JSDoc. Incluye suite de pruebas unitarias con Jest (38 tests, 6 suites).

```
API → http://localhost:3000/api
Docs → http://localhost:3000/api/docs
```

---

## Modules

### Auth
JWT login/register con `jsonwebtoken.verify()` directo (sin Passport strategy).  
Incluye flujo de recuperación de contraseña.
- `POST /api/auth/login` — email + password → JWT
- `POST /api/auth/register` — create account → JWT
- `POST /api/auth/forgot-password` — solicita código de recuperación
- `POST /api/auth/reset-password` — restablece contraseña con código

### Users
User CRUD con roles (`client` | `admin`).
- `GET /api/users` — list all (JWT)
- `GET /api/users/:id` — get by UUID (JWT)
- `PUT /api/users/:id` — update (JWT)
- `DELETE /api/users/:id` — delete (JWT)

### Services
Service catalog (Chatbots, Automation, Autonomous Agents).
- `GET /api/services` — list sorted by sortOrder (public)
- `GET /api/services/:id` — get by UUID (public)
- `POST /api/services` — create (JWT)
- `PUT /api/services/:id` — update (JWT)
- `DELETE /api/services/:id` — delete (JWT)

### Cases
Success stories / case studies.
- `GET /api/cases` — list published (newest first) (public)
- `GET /api/cases/:id` — get by UUID (public)
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
**Agent A1** — Floating widget chatbot (rule-based → LLM future).
- `POST /api/chat/message` — process message (public)
- `GET /api/chat/history` — get session history

### Demo
**Agent A2** — Interactive demo (rule-based).
- `POST /api/demo/message` — process message (public)

### Calendar
Meeting scheduling (mock → Calendly/Cal.com).
- `GET /api/calendar/slots?date=` — available slots
- `POST /api/calendar/book` — create booking

### Admin
Panel de administración protegido (`AdminGuard` + `JwtAuthGuard`).
- `GET /api/admin/stats` — conteos globales
- `GET /api/admin/users` — listar usuarios
- `PATCH /api/admin/users/:id/role` — cambiar rol
- `PATCH /api/admin/users/:id/status` — activar/desactivar
- `DELETE /api/admin/users/:id` — eliminar usuario
- `GET /api/admin/services` — listar servicios
- `POST /api/admin/services` — crear servicio
- `PUT /api/admin/services/:id` — actualizar servicio
- `DELETE /api/admin/services/:id` — eliminar servicio
- `GET /api/admin/cases` — listar casos
- `POST /api/admin/cases` — crear caso
- `PUT /api/admin/cases/:id` — actualizar caso
- `DELETE /api/admin/cases/:id` — eliminar caso
- `GET /api/admin/contacts` — listar contactos
- `PATCH /api/admin/contacts/:id/read` — marcar leído
- `DELETE /api/admin/contacts/:id` — eliminar contacto
- `GET /api/admin/chat-logs` — historial de chat

### Health
- `GET /api/health` — service status

---

## Tech Stack

| Dependency | Version | Purpose |
|------------|---------|---------|
| @nestjs/core | 11 | Framework |
| @nestjs/typeorm | 11 | ORM |
| @nestjs/jwt | 11 | JWT signing/verification |
| @nestjs/swagger | 11 | API docs |
| typeorm | 1 | Database ORM |
| pg | 8 | PostgreSQL driver |
| bcrypt | 6 | Password hashing |
| jest | 29+ | Unit testing |
| ts-jest | 29+ | TypeScript Jest transformer |

---

## Database

PostgreSQL 16 with 5 tables: `users`, `services`, `cases`, `contacts`, `chat_logs`.

See `SPEC.md` for full entity schemas.

---

## Seed Data

Run `npm run seed` to populate:
- 1 admin user (`admin@aiplatform.com` / `admin123`)
- 3 services
- 2 success stories

Idempotente — se puede ejecutar múltiples veces sin duplicar datos.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Watch mode (dev) |
| `npm run build` | Compile to dist/ |
| `npm run start:prod` | Run compiled dist/main.js |
| `npm run lint` | ESLint |
| `npm test` | Jest (38 tests, 6 suites) |
| `npm run seed` | Seed database |

---

## Testing

```bash
npm test
# Result: 38 passed, 6 suites
```

| Suite | Tests | Description |
|-------|-------|-------------|
| `auth.service.spec.ts` | 11 | validateUser, login, register, forgot/reset password |
| `users.service.spec.ts` | 8 | CRUD con TypeORM mock |
| `admin.guard.spec.ts` | 3 | role check con ExecutionContext mock |
| `health.controller.spec.ts` | 1 | status ok + timestamp |
| `chat.service.spec.ts` | 7 | keyword matching, DB persistence |
| `demo.service.spec.ts` | 7 | keyword matching, stateless |

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

---

## Code Comments

Todo el código fuente (44 archivos `.ts`) está comentado en español con JSDoc:
- Descripción del archivo al inicio
- Clases exportadas
- Métodos públicos con `@param` / `@returns`
- Comentarios inline en lógica compleja
