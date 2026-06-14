import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService } from './calendar.service';

describe('CalendarService', () => {
  let service: CalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalendarService],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
  });

  describe('getAvailableSlots', () => {
    it('debe retornar una lista de slots mock', async () => {
      const slots = await service.getAvailableSlots('2026-06-15');

      expect(Array.isArray(slots)).toBe(true);
      expect(slots.length).toBeGreaterThan(0);
      expect(slots[0]).toHaveProperty('time');
      expect(slots[0]).toHaveProperty('available');
    });
  });

  describe('createBooking', () => {
    it('debe retornar una confirmación mock', async () => {
      const result = await service.createBooking({
        name: 'John',
        email: 'john@example.com',
        date: '2026-06-15',
        time: '10:00',
      });

      expect(result.success).toBe(true);
      expect(result.bookingId).toBe('mock-booking-id');
      expect(result.message).toBe('Booking created successfully');
    });
  });
});
