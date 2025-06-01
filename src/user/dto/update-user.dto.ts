import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  oldPassword: string; // previous password

  @IsString()
  newPassword: string; // new password
}
