import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway], // 👈 ضروري عشان الموديولات الثانية تقدر تستخدم الـ gateway
})
export class EventsModule {}
