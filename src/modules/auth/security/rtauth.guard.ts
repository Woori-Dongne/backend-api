import { Injectable } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class RTAuthGuard extends NestAuthGuard('rt-jwt') {}
