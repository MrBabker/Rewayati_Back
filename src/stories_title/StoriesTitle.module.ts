import { Module } from '@nestjs/common';
import { StoriesControllers } from './Stories.controller';
import { StoriesSrvices } from './Stories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from './entites/Stories.Entity';

@Module({
  imports: [TypeOrmModule.forFeature([Story])],
  controllers: [StoriesControllers],
  providers: [StoriesSrvices],
})
export class StoriesModule {}
