// src/events/events.gateway.ts
import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // خليه محدد دومينك في الإنتاج
  },
})
@Injectable()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  // مثال على استقبال رسالة من العميل
  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: any) {
    console.log('Received message:', data);
    this.server.emit('newMessage', data); // يبث للجميع
  }

  // دالة تقدر تناديها من أي مكان في الباك اند
  sendUpdate(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}
