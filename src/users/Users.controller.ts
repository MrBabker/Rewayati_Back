import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegistUserDTO } from './DTOs/RegistDTO';
import { UserServices } from './Users.service';
import type { Response } from 'express';
import { LoginUserDTO } from './DTOs/Login.DTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from './Guards/Auth.guard';

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

  @Post('log2')
  public async loginUserNoCookie(@Body() DTO: LoginUserDTO) {
    return this.userServics.loginUser(DTO);
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

  @UseGuards(AuthGuard)
  @Post('out2')
  public LogOut2() {
    return { message: 'logged out ' };
  }

  @Post('img:id')
  @UseInterceptors(
    FileInterceptor('meal-img', {
      storage: diskStorage({
        destination: './images/profile',
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
          const filename = `${prefix}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Unsupported file format'), false);
        }
      },
      limits: { fileSize: 1024 * 1024 * 2 },
    }),
  )
  public SetMealImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!file) throw new BadRequestException('no file');
    return this.userServics.SetImage(id, file.filename);
  }

  @Post('delimg:id')
  public RemoveImage(@Param('id', ParseIntPipe) id: number) {
    return this.userServics.RemoveImage(id);
  }

  @Get(':image')
  public ShowProfileImage(@Param('image') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: 'images/profile' });
  }
}
