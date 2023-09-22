import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '@educational-plan/types';

export class UpdateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
