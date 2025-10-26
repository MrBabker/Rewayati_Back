import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { StoriesSrvices } from './Stories.service';
import { CreateStoryDTO } from './DTOs/CreateStory.DTO';

@Controller('stories')
export class StoriesControllers {
  constructor(@Inject() private readonly storiesServices: StoriesSrvices) {}

  @Get('getall')
  public getAllStories() {
    return this.storiesServices.getAllStories();
  }

  @Post('create')
  public createStory(@Body() dto: CreateStoryDTO) {
    return this.storiesServices.createStory(dto);
  }
}
