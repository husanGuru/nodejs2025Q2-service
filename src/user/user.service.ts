import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

import * as bcrypt from 'bcrypt';
import { jwtConstants } from 'src/utils/constants';

@Injectable()
export class UserService {
  constructor(private prisma: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    let user = await this.prisma.user.findFirst({
      where: { login: createUserDto.login },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      const salt = await bcrypt.genSalt(jwtConstants.salt);

      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      user = await this.prisma.user.create({
        data: { ...createUserDto, password: hashedPassword },
        select: {
          id: true,
          login: true,
          version: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    return {
      ...user,
      createdAt: new Date(user.createdAt).getTime(),
      updatedAt: new Date(user.updatedAt).getTime(),
    };
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} doesn't exist`);
    }

    return {
      ...user,
      createdAt: new Date(user.createdAt).getTime(),
      updatedAt: new Date(user.updatedAt).getTime(),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} doesn't exist`);
    }

    const isValidPassword = await bcrypt.compare(
      updateUserDto.oldPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw new ForbiddenException(`Old password is wrong`);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: { password: updateUserDto.newPassword, version: { increment: 1 } },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...updatedUser,
      createdAt: new Date(updatedUser.createdAt).getTime(),
      updatedAt: new Date(updatedUser.updatedAt).getTime(),
    };
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} doesn't exist`);
    }
    await this.prisma.user.delete({ where: { id: id } });

    return `User with id ${id} was deleted`;
  }
}
