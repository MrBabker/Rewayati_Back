import { InjectRepository } from '@nestjs/typeorm';
import { Story } from './entites/Stories.Entity';
import { Repository } from 'typeorm';
import { CreateStoryDTO } from './DTOs/CreateStory.DTO';
import { BadRequestException } from '@nestjs/common';

export class StoriesSrvices {
  constructor(
    @InjectRepository(Story) private readonly storyrepo: Repository<Story>,
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
      creator: 'someOne',
      title: dto.title,
      description: dto.description,
      subtitles: dto.subtitles,
      subjects: dto.subjects,
    });

    return this.storyrepo.save(newStory);
  }
}
