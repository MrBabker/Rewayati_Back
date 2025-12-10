import { Module } from '@nestjs/common';
import { StoriesControllers } from './Stories.controller';
import { StoriesSrvices } from './Stories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from './entites/Stories.Entity';
import { EventsModule } from 'src/events/events.module';
import { UsersModule } from 'src/users/Users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Story]),
    EventsModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (conig: ConfigService) => {
        return {
          global: true,
          secret: conig.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '30d' },
        };
      },
    }),
  ],
  controllers: [StoriesControllers],
  providers: [StoriesSrvices],
})
export class StoriesModule {}
