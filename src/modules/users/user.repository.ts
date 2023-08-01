import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserInfoDTO } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { Friends } from './entities/friends.entity';
import { Regions } from './entities/region.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Friends)
    private readonly friendRepository: Repository<Friends>,
    @InjectRepository(Regions)
    private readonly regionRepository: Repository<Regions>,
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
    region: number,
  ): Promise<Users> {
    const user: Partial<Users> = {
      id: userId,
      userName: updateUserInfoDTO.userName,
      role: updateUserInfoDTO.role,
      phoneNumber: updateUserInfoDTO.phoneNumber,
      imageUrl: updateUserInfoDTO?.imageUrl,
      regionId: region,
    };

    return await this.userRepository.save(user);
  }

  async isfollowing(friendId: number, userId: number): Promise<boolean> {
    const friend = await this.friendRepository.findOne({
      where: { friendId, userId },
    });

    return !!friend;
  }

  async checkRegion(name: string): Promise<number> {
    let region = await this.regionRepository.findOne({
      where: { name },
    });

    if (!region) region = await this.regionRepository.save({ name });

    return region.id;
  }
}
