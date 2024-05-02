import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/public';
import { Repository } from 'typeorm';
import { JwtBlackList } from './entities/jwtBlackList.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  blackListedTokens: JwtBlackList[] = [];
  constructor(
    @Inject('JWT_BLACK_LIST_REPOSITORY')
    private readonly jwtBlackListRepository: Repository<JwtBlackList>,
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UsersService,
  ) {
    this.jwtBlackListRepository.find().then((data) => {
      this.blackListedTokens = data;
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const isTokenBlackListed = this.blackListedTokens.find(
      (blt) => blt.jwtToken === token,
    );

    if (isTokenBlackListed) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = await this.userService.findOneBy(
        { id: payload.sub },
        {
          relations: ['Roles', 'Roles.permissions', 'Roles.permissions.module'],
        },
      );
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
