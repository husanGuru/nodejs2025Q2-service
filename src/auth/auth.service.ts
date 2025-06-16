import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DatabaseService,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
  }

  async login(createUserDto: Prisma.UserCreateInput) {
    const user = await this.prisma.user.findFirst({
      where: { login: createUserDto.login },
    });

    if (!user) {
      throw new ForbiddenException('Invalid login or password');
    }

    const isValidPassword = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new ForbiddenException('Invalid login or password');
    }

    return this.generateUserTokens({ id: user.id, login: user.login });
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        token: refreshTokenDto.refreshToken,
        expiryDate: {
          gte: new Date(),
        },
      },
      include: { user: true },
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    return this.generateUserTokens({
      id: refreshToken.userId,
      login: refreshToken.user.login,
    });
  }

  private async generateUserTokens(user: { id: string; login: string }) {
    const accessToken = this.jwtService.sign({
      userId: user.id,
      login: user.login,
    });
    const refreshToken = crypto.randomUUID();

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1); // 1 day from now

    await this.prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiryDate: expiryDate,
      },
    });

    return { accessToken, refreshToken };
  }
}
