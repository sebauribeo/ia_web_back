import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DemoService } from './demo.service';

@ApiTags('demo')
@Controller('demo')
export class DemoController {
  constructor(private demoService: DemoService) {}

  @Post('message')
  @ApiOperation({
    summary: 'Send message to interactive demo AI',
    description: 'Processes a message through the Demo Agent (A2). Stateless — no persistence. Returns enriched responses with markdown-style formatting.',
  })
  @ApiResponse({ status: 200, description: 'Returns the demo AI response text' })
  async sendMessage(@Body() body: { message: string }) {
    const response = await this.demoService.processDemoMessage(body.message);
    return { response };
  }
}
