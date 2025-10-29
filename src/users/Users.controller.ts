import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { RegistUserDTO } from './DTOs/RegistDTO';
import { UserServices } from './Users.service';
import type { Response } from 'express';
import { LoginUserDTO } from './DTOs/Login.DTO';

@Controller('users')
export class UserControllers {
  constructor(@Inject() private readonly userServics: UserServices) {}

  @Get('getall')
  public getAllUsers() {
    return this.userServics.getallUsers();
  }

  @Post('reg')
  public async registUser(
    @Body() dto: RegistUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accsessToken = await this.userServics.register(dto);
    res.cookie('jwt', accsessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'User created successfully' };
  }

  @Post('log')
  public async loginUser(
    @Body() DTO: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accsessToken = await this.userServics.loginUser(DTO);

    res.cookie('jwt', accsessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      message: 'User Loged successfully welcom ',
     /* payload: accsessToken.payload,*/
    };
  }

  @Post('out')
  public LogOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(0),
    });

    return { message: 'logged out ' };
  }
}
