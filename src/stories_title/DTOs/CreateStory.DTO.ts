import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateStoryDTO {
  @IsString()
  @ApiProperty({ description: '' })
  title: string;
  @IsString()
  @ApiProperty({ description: '' })
  description: string;
  @ApiProperty({ description: '' })
  subtitles: string[];
  @ApiProperty({ description: '' })
  subjects: string[];
}
