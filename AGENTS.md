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
| **State** | 🟡 Active (rule-based) |

### Behavior
```
User → ChatWidget → POST /api/chat/message{sessionId?}
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
| **State** | 🟢 Active |

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
