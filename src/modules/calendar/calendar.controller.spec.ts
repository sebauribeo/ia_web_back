import { Test, TestingModule } from '@nestjs/testing';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

describe('CalendarController', () => {
  let controller: CalendarController;
  let calendarService: jest.Mocked<CalendarService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [
        {
          provide: CalendarService,
          useValue: {
            getAvailableSlots: jest.fn(),
            createBooking: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CalendarController>(CalendarController);
    calendarService = module.get(CalendarService) as jest.Mocked<CalendarService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /calendar/slots', () => {
    it('debe retornar slots disponibles', async () => {
      const slots = [
        { time: '09:00', available: true },
        { time: '10:00', available: false },
      ];
      calendarService.getAvailableSlots.mockResolvedValue(slots);

      const result = await controller.getAvailableSlots('2026-06-15');

      expect(calendarService.getAvailableSlots).toHaveBeenCalledWith('2026-06-15');
      expect(result).toEqual(slots);
    });
  });

  describe('POST /calendar/book', () => {
    it('debe crear una reserva', async () => {
      const booking = { success: true, bookingId: 'mock-id', message: 'Booking created' };
      calendarService.createBooking.mockResolvedValue(booking);

      const body = { name: 'John', email: 'john@example.com', date: '2026-06-15', time: '10:00' };
      const result = await controller.createBooking(body);

      expect(calendarService.createBooking).toHaveBeenCalledWith(body);
      expect(result).toEqual(booking);
    });
  });
});
