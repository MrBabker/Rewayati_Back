import { Module } from '@nestjs/common';
import { UserControllers } from './Users.controller';
import { UserServices } from './Users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/User.entite';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserControllers],
  providers: [UserServices],
})
export class UsersModule {}
