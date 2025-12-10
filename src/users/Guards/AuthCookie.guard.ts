import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CURRENT_USER_KEY, JWT_Payload } from 'src/utils';

@Injectable()
export class AuthGuardCookie implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const cookies = request.cookies as { jwt?: string };
    const token = cookies.jwt;

    console.log(token);
    if (token) {
      try {
        const payload: JWT_Payload = await this.jwtService.verifyAsync(token, {
          secret: this.config.get<string>('SECURITY_KEY'),
        });
        console.log(payload.username);
        request[CURRENT_USER_KEY] = payload;
      } catch(e) {
        console.log(e);
        return false;
      }
    } else {
      console.log('Uthorized');
      throw new UnauthorizedException();
    }

    return true;
  }
}
