import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '@educational-plan/types';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
