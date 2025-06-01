import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  users: User[] = [];

  create(createUserDto: CreateUserDto) {
    const user = new User({
      id: crypto.randomUUID(),
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      login: createUserDto.login,
      password: createUserDto.password,
    });
    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} doesn't exist`);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} doesn't exist`);
    }

    if (this.users[userIndex].password !== updateUserDto.oldPassword) {
      throw new ForbiddenException(`Old password is wrong`);
    }
    this.users[userIndex].password = updateUserDto.newPassword;
    return this.users[userIndex];
  }

  remove(id: string) {
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} doesn't exist`);
    }
    this.users.splice(userIndex, 1);
    return `User with id ${id} was deleted`;
  }
}
