import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/security/auth.guard';
import { RequestUser } from '../auth/type/req.interface';
import { UpdateUserInfoDTO } from './dto/user.dto';
import { CreateReportDto } from './dto/report.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('/follow')
  async getFriendList(@Req() req: RequestUser) {
    const userId = req.user.id;
    return await this.userService.getFriendList(userId);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async updateUserInfo(
    @Req() req: RequestUser,
    @Body() updateUserInfoDTO: UpdateUserInfoDTO,
  ) {
    const userId = req.user.id;
    return this.userService.updateUserInfo(userId, updateUserInfoDTO);
  }

  @UseGuards(AuthGuard)
  @Get('/:friendId')
  async findUserById(
    @Req() req: RequestUser,
    @Param('friendId') friendId: number,
  ) {
    const userId = req.user.id;
    return await this.userService.findUserById(friendId, userId);
  }

  @UseGuards(AuthGuard)
  @Post('report')
  async createReport(
    @Req() req: RequestUser,
    @Body() createReportDto: CreateReportDto,
  ) {
    const userId = req.user.id;

    return await this.userService.createReport(userId, createReportDto);
  }

  @UseGuards(AuthGuard)
  @Post('/follow/:friendId')
  async following(
    @Req() req: RequestUser,
    @Param('friendId') friendId: number,
  ) {
    const userId = req.user.id;

    return await this.userService.following({
      userId,
      friendId,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/follow/:friendId')
  async unfollowing(
    @Req() req: RequestUser,
    @Param('friendId') friendId: number,
  ) {
    const userId = req.user.id;
    return await this.userService.unfollowing({
      userId,
      friendId,
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  async getUserInfo(@Req() req: RequestUser): Promise<UpdateUserInfoDTO> {
    const userId = req.user.id;
    return this.userService.getUserInfo(userId);
  }
}
