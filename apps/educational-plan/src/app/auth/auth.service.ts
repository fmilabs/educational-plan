import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import { hashSync, compareSync } from "bcrypt";
import { JwtPayloadDto } from './dto/JwtPayloadDto';
import { User } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';
import { AuthResponse } from '@educational-plan/types';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService, private dataSource: DataSource) {}

  // public async changePassword({ token, password }: ChangePasswordDto) {
  //   if(password.length < 8) {
  //     throw new BadRequestException('Parola trebuie să conțină minimum 8 caractere.');
  //   }
  //   const tokenResult = await this.usersService.findToken(token);
  //   if(!tokenResult || tokenResult.used) {
  //     throw new BadRequestException('Token invalid.');
  //   }
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   tokenResult.user.password = hashSync(password, 10);
  //   tokenResult.used = true;
  //   try {
  //     await queryRunner.manager.save(tokenResult.user);
  //     await queryRunner.manager.save(tokenResult);
  //     await queryRunner.commitTransaction();
  //     return this.login(tokenResult.user);
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw new BadRequestException('A apărut o eroare.');
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async checkToken(token: string) {
  //   const tokenResult = await this.usersService.findToken(token);
  //   if(!tokenResult || tokenResult.used) {
  //     throw new BadRequestException('Token invalid.');
  //   }
  //   return { email: tokenResult.user.email };
  // }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = (await this.usersService.findOneByEmail(email));
    if (user && compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<AuthResponse> {
    const payload: JwtPayloadDto = { email: user.email, role: user.role, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async validateUserByJwt(payload: JwtPayloadDto) {
    const user = await this.usersService.findOne(payload.sub);
    if (user) {
      return user;
    }
    return null;
  }
}
