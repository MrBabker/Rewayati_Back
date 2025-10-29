import { Module } from '@nestjs/common';
import { UserControllers } from './Users.controller';
import { UserServices } from './Users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/User.entite';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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

  controllers: [UserControllers],
  providers: [UserServices],
})
export class UsersModule {}
