import { Repository } from 'typeorm';
import { User } from './entites/User.entite';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistUserDTO } from './DTOs/RegistDTO';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'node_modules/bcryptjs';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { JWT_Payload } from 'src/utils';
import { LoginUserDTO } from './DTOs/Login.DTO';

export class UserServices {
  constructor(
    @InjectRepository(User) private readonly userrepo: Repository<User>,
    private readonly jwtServices: JwtService,
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

    const newU = await this.userrepo.save(newUser);

    const payload: JWT_Payload = {
      id: newU.id,
      username: newU.username,
      email: newU.email,
      isvalidate: newU.isvalidate,
      createdAt: newU.createdAt,
      updatedAt: newU.updatedAt,
    };

    const accsessToken = await this.jwtServices.signAsync(payload);

    return { message: accsessToken };
  }

  public async loginUser(DTO: LoginUserDTO) {
    const user = await this.userrepo.findOne({ where: { email: DTO.email } });
    if (user === null) {
      throw new BadRequestException('No account with this email');
    } else {
      const matchPassword = bcrypt.compareSync(DTO.password, user.password);
      if (!matchPassword)
        throw new UnauthorizedException('invalid email or password');

      const payload: JWT_Payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        isvalidate: user.isvalidate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      const accsessToken = await this.jwtServices.signAsync(payload);

      return accsessToken;
    }
  }
}
