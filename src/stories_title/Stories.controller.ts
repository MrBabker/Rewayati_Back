import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StoriesSrvices } from './Stories.service';
import { CreateStoryDTO } from './DTOs/CreateStory.DTO';
import { AuthGuard } from 'src/users/Guards/Auth.guard';
import { JwtService } from '@nestjs/jwt';
import { CurrntDecorator } from 'src/users/decorators/Current-user.decorator';
import type { JWT_Payload } from 'src/utils';
import { AuthGuardCookie } from 'src/users/Guards/AuthCookie.guard';

@Controller('stories')
export class StoriesControllers {
  constructor(
    @Inject() private readonly storiesServices: StoriesSrvices,
    private readonly jwtServices: JwtService,
  ) {}

  @Get('getall')
  public getAllStories() {
    return this.storiesServices.getAllStories();
  }

  @Get('get/:id')
  public getStory(@Param('id', ParseIntPipe) id: number) {
    return this.storiesServices.getStory(id);
  }
  @UseGuards(AuthGuardCookie)
  @Post('create')
  public createStory(@Body() dto: CreateStoryDTO) {
    return this.storiesServices.createStory(dto);
  }

  @UseGuards(AuthGuardCookie)
  @Delete('del/:id')
  public deleteStory(
    @Param('id', ParseIntPipe) id: number,
    @CurrntDecorator() payload: JWT_Payload,
  ) {
    return this.storiesServices.deleteStory(id, payload);
  }
}
