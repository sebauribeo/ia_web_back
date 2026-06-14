import { Injectable } from '@nestjs/common';

/**
 * Demo Agent — A2 in AGENTS.md
 * Provides interactive AI demonstration for the /demo page.
 * Stateless, rule-based responses with richer formatting than ChatService.
 */
@Injectable()
export class DemoService {
  /**
   * Process a demo chat message and return a formatted response.
   * Stateless — each call is independent. No DB persistence.
   * @param message - Raw user input
   * @returns Formatted response string (markdown-style formatting)
   */
  async processDemoMessage(message: string): Promise<string> {
    const lower = message.toLowerCase();

    if (lower.includes('hola') || lower.includes('hi')) {
      return '¡Hola! Soy el asistente de IA de AI Platform. ¿Cómo puedo ayudarte hoy?';
    }
    if (lower.includes('servicio') || lower.includes('qué hacen')) {
      return 'Ofrecemos tres servicios principales:\n\n1. **Chatbots Inteligentes** - Asistentes virtuales 24/7\n2. **Automatización de Procesos** - RPA e IA inteligente\n3. **Agentes Autónomos** - Agentes que toman decisiones\n\n¿Te interesa alguno en particular?';
    }
    if (lower.includes('chatbot') || lower.includes('chat')) {
      return 'Nuestros chatbots utilizan **NLP avanzado** para:\n\n• Entender contexto y matices\n• Responder en múltiples idiomas\n• Integrarse con tu CRM\n• Aprender de cada interacción\n\n¿Quieres ver una demo en vivo?';
    }
    if (lower.includes('automatiz') || lower.includes('proceso')) {
      return 'La automatización de procesos te permite:\n\n• Eliminar tareas repetitivas\n• Reducir errores humanos\n• Ahorrar tiempo y dinero\n• Escalar sin contratar más personal\n\n¿Qué procesos te gustaría automatizar?';
    }
    if (lower.includes('precio') || lower.includes('costo')) {
      return 'Nuestros planes se adaptan a tu negocio:\n\n• **Starter**: Desde $5,000 CLP/mes\n• **Business**: Desde $15,000 CLP/mes\n• **Enterprise**: Personalizado\n\n¿Te gustaría una cotización personalizada?';
    }

    return 'Gracias por tu pregunta. Nuestro equipo puede darte información más detallada. ¿Quieres agendar una reunión con nosotros?';
  }
}
