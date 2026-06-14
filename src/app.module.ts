import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ServicesModule } from './modules/services/services.module';
import { CasesModule } from './modules/cases/cases.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { ChatModule } from './modules/chat/chat.module';
import { DemoModule } from './modules/demo/demo.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthController } from './modules/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'ai_platform',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),

    AuthModule,
    UsersModule,
    ServicesModule,
    CasesModule,
    ContactsModule,
    ChatModule,
    DemoModule,
    CalendarModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
