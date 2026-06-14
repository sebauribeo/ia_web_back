/**
 * Servicio de calendario.
 * Proporciona métodos para consultar disponibilidad y crear reservas.
 * Actualmente usa datos simulados; en producción se integrará con
 * Calendly o Cal.com.
 */
import { Injectable } from '@nestjs/common';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingConfirmation {
  success: boolean;
  bookingId: string;
  message: string;
}

@Injectable()
export class CalendarService {
  async getAvailableSlots(date: string): Promise<TimeSlot[]> {
    return [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: false },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
    ];
  }

  async createBooking(data: {
    name: string;
    email: string;
    date: string;
    time: string;
    message?: string;
  }): Promise<BookingConfirmation> {
    return {
      success: true,
      bookingId: 'mock-booking-id',
      message: 'Booking created successfully',
    };
  }
}
