# Backend — AI Agents

---

## A1: Chatbot Agent

Floating widget chatbot for support and lead qualification.

| Property | Value |
|----------|-------|
| **ID** | A1 |
| **Type** | Rule-based → LLM (future) |
| **Module** | `src/modules/chat/` |
| **Frontend** | `ChatWidget.tsx` (floating bubble, all pages) |
| **State** | 🟢 Active (rule-based, connected to backend) |
| **Tests** | `src/modules/chat/chat.service.spec.ts` (7 tests) |

### Behavior
```
User → ChatWidget → POST /api/chat/message { sessionId? }
  → save user msg to chat_logs
  → generateResponse() keyword matching
  → save assistant response to chat_logs
  → return { response }
```

### Response Rules
| Keyword | Response |
|---------|----------|
| `hola`, `hi` | ¡Hola! ¿Cómo puedo ayudarte hoy? |
| `servicio` | Ofrecemos chatbots, automatización y agentes autónomos. |
| `precio` | Planes desde $5,000 CLP/mes. ¿Cotización? |
| *default* | Ofrece ayuda / redirige a contacto |

### Frontend Connection
- `ChatWidget.tsx` envía mensajes a `POST /api/chat/message` mediante `chat.ts` service
- Scroll automático, sessionId persistido en localStorage

### Future Config
```typescript
interface AgentConfig {
  model: 'gpt-4' | 'claude-3' | 'gemini-pro';
  temperature: 0.7;
  maxTokens: 1024;
  systemPrompt: 'Eres un asistente de ventas para AI Platform...';
  contextWindow: 10;
}
```

### Pending
- [ ] LLM integration (OpenAI/Claude)
- [ ] SSE streaming responses
- [ ] Session context maintenance

---

## A2: Demo Agent

Interactive AI demonstration for `/demo` page. Prospecting & conversion.

| Property | Value |
|----------|-------|
| **ID** | A2 |
| **Type** | Rule-based |
| **Module** | `src/modules/demo/` |
| **Frontend** | `Demo.tsx` (full page at /demo) |
| **State** | 🟢 Active (connected to backend) |
| **Tests** | `src/modules/demo/demo.service.spec.ts` (7 tests) |

### Behavior
```
User → Demo UI → POST /api/demo/message
  → processDemoMessage() keyword matching
  → return enriched response (markdown-style formatting)
```

### Response Rules
| Keyword | Topic | Format |
|---------|-------|--------|
| `hola`, `hi`, `buenos` | Greeting | Plain |
| `servicio`, `qué hacen` | 3 services overview | Bold + bullets |
| `chatbot`, `chat` | NLP features | Bold + bullets |
| `automatiz`, `proceso` | RPA benefits | Bold + bullets |
| `precio`, `costo` | 3 pricing tiers | Bold + plain |
| *default* | CTA → schedule meeting | Plain |

### Differences from A1
| Aspect | A1 Chatbot | A2 Demo |
|--------|-----------|---------|
| Purpose | Support / qualification | Prospecting / conversion |
| Response | Short text | Rich (multi-line, formatting) |
| Persistence | chat_logs table | None (stateless) |
| Session | sessionId | Per-message |
| Location | Floating widget | Full page /demo |

### Future
- [ ] LLM integration for dynamic responses
- [ ] Lead capture (email before demo)
- [ ] Purchase intent analysis

---

## A3: Admin Agent

Management console for platform administrators.

| Property | Value |
|----------|-------|
| **ID** | A3 |
| **Type** | CRUD + Dashboard |
| **Module** | `src/modules/admin/` |
| **Frontend** | `Admin.tsx` (full page at /admin) |
| **State** | 🟢 Active |
| **Tests** | `src/modules/admin/admin.guard.spec.ts` (3 tests) |

### Tabs
| Tab | Content |
|-----|---------|
| Dashboard | Stats cards + progress bars + activity |
| Usuarios | Table with role toggle, status toggle, lastLoginAt, delete |
| Servicios | Table + Add/Edit modal (title, icon, features, sortOrder) |
| Casos | Table + Add/Edit modal (client, industry, results, publish) |
| Contactos | Message cards with mark-read + delete |
| Chat Logs | Table of all chatbot conversations |

### Behavior
```
Admin logs in → role === 'admin'
  → JWT includes role in payload
  → AdminGuard checks request.user.role
  → Admin page renders all tabs
```
