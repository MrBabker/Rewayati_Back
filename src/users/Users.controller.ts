import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { RegistUserDTO } from './DTOs/RegistDTO';
import { UserServices } from './Users.service';

@Controller('users')
export class UserControllers {
  constructor(@Inject() private readonly userServics: UserServices) {}

  @Get('getall')
  public getAllUsers() {
    return this.userServics.getallUsers();
  }

  @Post('reg')
  public registUser(@Body() dto: RegistUserDTO) {
    return this.userServics.register(dto);
  }
}
