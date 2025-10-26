import { Repository } from 'typeorm';
import { User } from './entites/User.entite';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistUserDTO } from './DTOs/RegistDTO';
import { BadRequestException } from '@nestjs/common';
import bcrypt from 'node_modules/bcryptjs';
import { plainToInstance } from 'class-transformer';

export class UserServices {
  constructor(
    @InjectRepository(User) private readonly userrepo: Repository<User>,
  ) {}

  public async getallUsers() {
    const users = await this.userrepo.find();
    return plainToInstance(User, users);
  }

  public async register(dto: RegistUserDTO) {
    const user = await this.userrepo.findOne({ where: { email: dto.email } });
    if (user !== null)
      throw new BadRequestException('This email allready used');

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(dto.password, salt);

    const newUser = this.userrepo.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
    });

    return this.userrepo.save(newUser);
  }
}
