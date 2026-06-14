import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';

@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Get('slots')
  @ApiOperation({ summary: 'Get available time slots' })
  async getAvailableSlots(@Query('date') date: string) {
    return this.calendarService.getAvailableSlots(date);
  }

  @Post('book')
  @ApiOperation({ summary: 'Create a booking' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  async createBooking(
    @Body() body: {
      name: string;
      email: string;
      date: string;
      time: string;
      message?: string;
    },
  ) {
    return this.calendarService.createBooking(body);
  }
}
