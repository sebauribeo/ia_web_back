# Backend — API Specification

> **Base URL**: `/api` | **Auth**: Bearer JWT | **Format**: JSON

---

## 1. Auth

| Method | Path | Auth | Request | Response |
|--------|------|------|---------|----------|
| POST | `/auth/login` | LocalStrategy | `{ email, password }` | `{ access_token, user }` |
| POST | `/auth/register` | Public | `{ name, email, password }` | `{ access_token, user }` |
| POST | `/auth/forgot-password` | Public | `{ email }` | `{ message, devToken }` |
| POST | `/auth/reset-password` | Public | `{ email, token, newPassword }` | `{ message }` |

### Flow
```
register → check duplicate → bcrypt.hash(password,10) → UsersService.create() → login()
login   → validateUser() → check isActive → bcrypt.compare() → set lastLoginAt → JwtService.sign({ email, sub, role })
forgot  → find user → generate 6-digit code (15min expiry) → update user
reset   → find user → verify token + expiry → bcrypt.hash(newPassword,10) → update user
```

### JWT Payload
```json
{ "email": "user@example.com", "sub": "uuid", "role": "client|admin" }
```

### Auth Guards
- `JwtAuthGuard`: extrae token del header `Authorization: Bearer <token>`, verifica con `jsonwebtoken.verify()`, setea `request.user = { userId, email, role }`
- `LocalAuthGuard`: usa Passport LocalStrategy para validar email + password
- `AdminGuard`: verifica `user.role === 'admin'`

---

## 2. Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users` | JWT | List all |
| GET | `/users/:id` | JWT | Get by UUID |
| PUT | `/users/:id` | JWT | Partial update |
| DELETE | `/users/:id` | JWT | Delete |

### Entity: `users`
| Column | Type | Required | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID (PK) | Auto | gen_random_uuid() | — |
| email | varchar | ✅ | — | UNIQUE |
| password | varchar | ✅ | — | bcrypt hash |
| name | varchar | ✅ | — | — |
| company | varchar | — | NULL | — |
| phone | varchar | — | NULL | — |
| role | enum | — | `client` | `client` \| `admin` |
| isActive | boolean | — | `true` | Se verifica en login |
| lastLoginAt | datetime | — | NULL | Actualizado en cada login |
| resetToken | varchar | — | NULL | Código 6 dígitos |
| resetTokenExpires | datetime | — | NULL | 15 min desde generación |
| createdAt | datetime | Auto | now() | — |
| updatedAt | datetime | Auto | now() | — |

---

## 3. Services

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/services` | Public | List sorted by `sortOrder` ASC |
| GET | `/services/:id` | Public | Get by UUID |
| POST | `/services` | JWT | Create |
| PUT | `/services/:id` | JWT | Update |
| DELETE | `/services/:id` | JWT | Delete |

### Entity: `services`
| Column | Type | Required | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID (PK) | Auto | — | — |
| title | varchar | ✅ | — | Display name |
| description | text | ✅ | — | Long description |
| icon | varchar | ✅ | — | Lucide icon name |
| features | text[] | — | — | Feature bullets |
| useCases | text[] | — | — | Use case tags |
| isActive | boolean | — | `true` | Visibility toggle |
| sortOrder | integer | — | `0` | Display order |

### Seed
| Sort | Title | Icon |
|------|-------|------|
| 1 | Chatbots Inteligentes | MessageSquare |
| 2 | Automatización de Procesos | Workflow |
| 3 | Agentes Autónomos | Bot |

---

## 4. Cases

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/cases` | Public | List published (newest first) |
| GET | `/cases/:id` | Public | Get by UUID |
| POST | `/cases` | JWT | Create |
| PUT | `/cases/:id` | JWT | Update |
| DELETE | `/cases/:id` | JWT | Delete |

### Entity: `cases`
| Column | Type | Required | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID (PK) | Auto | — | — |
| title | varchar | ✅ | — | Headline |
| description | text | ✅ | — | Story body |
| clientName | varchar | ✅ | — | — |
| clientCompany | varchar | ✅ | — | — |
| image | varchar | — | NULL | URL |
| results | text[] | — | — | Bullet results |
| industry | varchar | — | NULL | — |
| isPublished | boolean | — | `true` | Visibility toggle |

### Filter
- Public `findAll`: only `isPublished = true`

### Seed
| Title | Company | Industry |
|-------|---------|----------|
| Chatbot para TechCorp MX | TechCorp | Technology |
| Automatización para InnovateLab | InnovateLab | Innovation |

---

## 5. Contacts

| Method | Path | Auth | Request Body | Description |
|--------|------|------|-------------|-------------|
| POST | `/contacts` | Public | `{ name, email, company?, phone?, type, budget?, projectType?, message }` | Submit |
| GET | `/contacts` | JWT | — | List |
| GET | `/contacts/:id` | JWT | — | Get |
| PATCH | `/contacts/:id/read` | JWT | — | Mark read |
| DELETE | `/contacts/:id` | JWT | — | Delete |

### Entity: `contacts`
| Column | Type | Required | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID (PK) | Auto | — | — |
| name | varchar | ✅ | — | — |
| email | varchar | ✅ | — | — |
| company | varchar | — | NULL | — |
| phone | varchar | — | NULL | — |
| type | enum | ✅ | — | `contact` \| `quote` \| `evaluation` |
| budget | varchar | — | NULL | Quote only |
| projectType | varchar | — | NULL | Evaluation only |
| message | text | ✅ | — | — |
| isRead | boolean | — | `false` | Admin flag |

### Form Types
| Type | Conditional | Purpose |
|------|------------|---------|
| contact | none | General inquiry |
| quote | `budget` | Budget estimation |
| evaluation | `projectType` | Project evaluation |

---

## 6. Chat

| Method | Path | Auth | Request | Response |
|--------|------|------|---------|----------|
| POST | `/chat/message` | Public | `{ message, sessionId?, userId? }` | `{ response }` |
| GET | `/chat/history` | Public | `?sessionId=x` | `ChatLog[]` |

### Entity: `chat_logs`
| Column | Type | Required | Notes |
|--------|------|----------|-------|
| id | UUID (PK) | Auto | — |
| sessionId | varchar | — | Groups messages |
| userId | varchar | — | Links to auth user |
| role | varchar | ✅ | `user` \| `assistant` |
| content | text | ✅ | Message body |
| createdAt | datetime | Auto | now() |

### Persistence
Both user and assistant messages saved to `chat_logs`. Ordered ASC for history.

---

## 7. Demo

| Method | Path | Auth | Request | Response |
|--------|------|------|---------|----------|
| POST | `/demo/message` | Public | `{ message }` | `{ response }` |

Stateless — no DB persistence, no session tracking.

### Differences from Chat
| Aspect | Chat | Demo |
|--------|------|------|
| Persistence | chat_logs | None |
| Session | sessionId | Per-message |
| Response | Short text | Rich (bullets, bold) |
| Goal | Support | Prospecting |

---

## 8. Calendar

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/calendar/slots` | Public | Available slots for date |
| POST | `/calendar/book` | Public | Create booking |

### Mock data (replace with Calendly/Cal.com)
```
GET /calendar/slots?date=2024-01-01
→ [{ time: "09:00", available: true }, ...]

POST /calendar/book { name, email, date, time, message? }
→ { success: true, bookingId: "mock-id", message: "..." }
```

---

## 9. Admin

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/stats` | Conteos globales (users, services, cases, contacts, unread, chat) |
| GET | `/admin/users` | Lista completa con lastLoginAt |
| PATCH | `/admin/users/:id/role` | Cambiar rol (`client` / `admin`) |
| PATCH | `/admin/users/:id/status` | Activar/desactivar usuario |
| DELETE | `/admin/users/:id` | Eliminar usuario |
| GET | `/admin/services` | Listar servicios |
| POST | `/admin/services` | Crear servicio |
| PUT | `/admin/services/:id` | Actualizar servicio |
| DELETE | `/admin/services/:id` | Eliminar servicio |
| GET | `/admin/cases` | Listar casos |
| POST | `/admin/cases` | Crear caso |
| PUT | `/admin/cases/:id` | Actualizar caso |
| DELETE | `/admin/cases/:id` | Eliminar caso |
| GET | `/admin/contacts` | Listar contactos |
| PATCH | `/admin/contacts/:id/read` | Marcar leído |
| DELETE | `/admin/contacts/:id` | Eliminar contacto |
| GET | `/admin/chat-logs` | Historial de chat (últimos 200) |

Todos protegidos con `JwtAuthGuard` + `AdminGuard`.

---

## 10. Health

| Method | Path | Response |
|--------|------|----------|
| GET | `/health` | `{ status: "ok", timestamp: ISO }` |

---

## General

### Auth
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT payload: `{ email, sub (userId), role }`
- JWT verification: `jsonwebtoken.verify()` directo en JwtAuthGuard
- Header: `Authorization: Bearer <token>`

### CORS
- Development: `http://localhost:5173`
- Production: restricted to deployed domain

### Pagination
Not yet implemented. Future: `?page=1&limit=20` on list endpoints.
