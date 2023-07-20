import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

import { AuthGuard } from '../auth/security/auth.guard';
import { RequestUser } from '../auth/type/req.interface';
import { UpdateUserInfoDTO } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Patch()
  async updateUserInfo(
    @Req() req: RequestUser,
    @Body() updateUserInfoDTO: UpdateUserInfoDTO,
  ) {
    const userId = req.user.id;
    return this.userService.updateUserInfo(userId, updateUserInfoDTO);
  }
}
