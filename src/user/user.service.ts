import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    const user = await this.prisma.user.create({
      data: createUserDto,
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

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

    if (user.password !== updateUserDto.oldPassword) {
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
