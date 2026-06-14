# Backend — API Specification

> **Base URL**: `/api` | **Auth**: Bearer JWT | **Format**: JSON

---

## 1. Auth

| Method | Path | Auth | Request | Response |
|--------|------|------|---------|----------|
| POST | `/auth/login` | LocalStrategy | `{ email, password }` | `{ access_token, user }` |
| POST | `/auth/register` | Public | `{ name, email, password }` | `{ access_token, user }` |

### Flow
```
register → check duplicate → bcrypt.hash(password,10) → UsersService.create() → login()
login   → LocalStrategy.validateUser() → bcrypt.compare() → JwtService.sign({ email, sub })
```

---

## 2. Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users` | — | List all |
| GET | `/users/:id` | — | Get by UUID |
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
| isActive | boolean | — | `true` | — |
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

## 9. Health

| Method | Path | Response |
|--------|------|----------|
| GET | `/health` | `{ status: "ok", timestamp: ISO }` |

---

## General

### Auth
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT payload: `{ email, sub (userId) }`
- Header: `Authorization: Bearer <token>`

### CORS
- Development: `http://localhost:5173`
- Production: restricted to deployed domain

### Pagination
Not yet implemented. Future: `?page=1&limit=20` on list endpoints.
