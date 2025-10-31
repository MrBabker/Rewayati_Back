import { InjectRepository } from '@nestjs/typeorm';
import { Story } from './entites/Stories.Entity';
import { Repository } from 'typeorm';
import { CreateStoryDTO } from './DTOs/CreateStory.DTO';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';
@Injectable()
export class StoriesSrvices {
  constructor(
    @InjectRepository(Story) private readonly storyrepo: Repository<Story>,
    private eventGetway: EventsGateway,
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

  public async deleteStory(id: number) {
    const story = await this.storyrepo.findOne({ where: { id: id } });

    if (story) {
      const newStory = await this.storyrepo.remove(story);
      this.eventGetway.sendUpdate('storydeleted', newStory);
      return `${newStory.title} has been deleted`;
    }
    return null;
  }
}
