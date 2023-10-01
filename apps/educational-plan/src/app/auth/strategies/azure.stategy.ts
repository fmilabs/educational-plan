import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayloadDto } from '../dto/JwtPayloadDto';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureStrategy extends PassportStrategy(Strategy, 'azure') {
  constructor(private authService: AuthService, configService: ConfigService) {
    super();
  }

  async validate(req: Request) {
    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return this.authService.validateUserByAzureBearer(req.headers['authorization'].split(' ')[1]);
  }
}
