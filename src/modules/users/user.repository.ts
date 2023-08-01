import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserInfoDTO } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { Friends } from './entities/friends.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Friends)
    private readonly friendRepository: Repository<Friends>,
  ) {}

  async getUserByEmail(email: string): Promise<Users> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    return await this.userRepository.save(createUserDto);
  }

  async findUserById(userId: number): Promise<Users | undefined> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['region'],
    });
  }

  async updateUserInfo(
    userId: number,
    updateUserInfoDTO: UpdateUserInfoDTO,
  ): Promise<Users> {
    const user = new Users();
    Object.assign(user, { id: userId }, updateUserInfoDTO);

    return await this.userRepository.save(user);
  }

  async isfollowing(friendId: number, userId: number): Promise<boolean> {
    const friend = await this.friendRepository.findOne({
      where: { friendId, userId },
    });

    return !!friend;
  }
}
