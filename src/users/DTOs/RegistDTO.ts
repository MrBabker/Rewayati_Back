import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegistUserDTO {
  @IsString()
  @ApiProperty({ description: '' })
  username: string;
  @IsString()
  @ApiProperty({ description: '' })
  email: string;
  @IsString()
  @ApiProperty({ description: '' })
  password: string;
}
