import { InjectRepository } from '@nestjs/typeorm';
import { Story } from './entites/Stories.Entity';
import { Repository } from 'typeorm';
import { CreateStoryDTO } from './DTOs/CreateStory.DTO';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';
import { JwtService } from '@nestjs/jwt';
import { JWT_Payload } from 'src/utils';
@Injectable()
export class StoriesSrvices {
  constructor(
    @InjectRepository(Story) private readonly storyrepo: Repository<Story>,
    private eventGetway: EventsGateway,
    private readonly jwtServices: JwtService,
  ) {}

  public async getAllStories() {
    return this.storyrepo.find({
      select: {
        id: true,
        title: true,
        createdAt: true,
        creator: true,
        description: true,
      },
    });
  }

  public async getStory(id: number) {
    return this.storyrepo.findOne({ where: { id: id } });
  }

  public async createStory(dto: CreateStoryDTO) {
    const existStory = await this.storyrepo.findOne({
      where: { title: dto.title },
    });

    if (existStory)
      throw new BadRequestException('there is a story with the same name');

    const newStory = this.storyrepo.create({
      creator: dto.creator,
      title: dto.title,
      description: dto.description,
      subtitles: dto.subtitles,
      subjects: dto.subjects,
    });

    this.eventGetway.sendUpdate('storydeleted', newStory);
    return this.storyrepo.save(newStory);
  }

  public async deleteStory(id: number, payload: JWT_Payload) {
    const story = await this.storyrepo.findOne({ where: { id: id } });

    if (story) {
      if (story.creator !== payload.username) {
        throw new ForbiddenException('You are not allowed to do this');
      }

      const newStory = await this.storyrepo.remove(story);
      this.eventGetway.sendUpdate('storydeleted', newStory);
      return `${newStory.title} has been deleted`;
    }
    return null;
  }
}
