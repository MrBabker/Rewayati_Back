import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDTO {
  @IsString()
  @ApiProperty({ description: '' })
  email: string;
  @IsString()
  @ApiProperty({ description: '' })
  password: string;
}
