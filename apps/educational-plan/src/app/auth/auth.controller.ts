import { Controller, Req, Post, UseGuards, Get, Query, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Request } from 'express';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import { AzureADAuthGuard } from './guards/azure-ad-auth.guard';
// import { Recaptcha } from '@nestlab/google-recaptcha';

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  // @Recaptcha()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    // @ts-ignore
    return this.authService.login(req.user);
  }

  @Public()
  @UseGuards(AzureADAuthGuard)
  @Post('login/azure')
  async loginAzure(@Req() req: Request) {
    // @ts-ignore
    return this.authService.login(req.user);
  }

  @Get("user")
  async user(@CurrentUser() user: User) {
    return user;
  }

  // @Public()
  // @Post("token/check")
  // async checkToken(@Body("token") token: string) {
  //   return this.authService.checkToken(token);
  // }

  // @Public()
  // @Post("token/change-password")
  // async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
  //   return this.authService.changePassword(changePasswordDto);
  // }
}
