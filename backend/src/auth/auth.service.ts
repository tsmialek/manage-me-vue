/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private refreshTokenStorage = new Map<string, string>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.name };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_SECRET,
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_SECRET,
    });
    this.refreshTokenStorage.set(user.id, refresh_token);

    return { access_token, refresh_token };
  }

  async refreshToken(
    id: string,
    refreshToken: string,
  ): Promise<{ access_token: string }> {
    const stored = this.refreshTokenStorage.get(id);
    if (!stored || stored !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });

      const newAccessToken = await this.jwtService.signAsync(
        { sub: payload.sub, username: payload.username },
        {
          secret: process.env.REFRESH_SECRET,
          expiresIn: '15m',
        },
      );

      return { access_token: newAccessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
