import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IServiceResponse } from '@lib/shared/interfaces/service-response.interface';
import { IPagination } from '@lib/shared/interfaces/pagination.interface';
import { PaginationDto } from '@lib/shared';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private passwordHashSalt = 10;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll({
    limit,
    page,
  }: PaginationDto): Promise<IServiceResponse<IPagination<UserEntity>>> {
    const users = await this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit - 1,
    });
    const usersCount = await this.userRepository.count();
    return {
      state: true,
      data: {
        items: users,
        limit: limit,
        page: page,
        total: usersCount,
      },
    };
  }

  async findById(id: string): Promise<IServiceResponse<UserEntity>> {
    const user = await this.userRepository.findOneBy({ id });
    return {
      state: !!user,
      data: user!,
      message: !!user ? 'user.finded' : 'user.notfound',
    };
  }

  async findByPhone(mobile: string): Promise<IServiceResponse<UserEntity>> {
    const user = await this.userRepository.findOneBy({ mobile });
    return {
      state: !!user,
      data: user!,
      message: !!user ? 'user.found' : 'user.notfound',
    };
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return {
      state: !!user,
      data: user,
      message: !!user ? 'user.found' : 'user.notfound',
    };
  }

  async findByEmailAndPass(
    email: string,
    pass: string,
  ): Promise<IServiceResponse<UserEntity | null>> {
    this.logger.log(`Find  by email: ${email}`);
    const { state, data: user } = await this.findByEmail(email);
    if (state) {
      try {
        const isMatch = await bcrypt.compare(pass, user?.password || '');
        if (!isMatch) {
          return {
            state: false,
            data: null,
            message: 'user.invalid-credential',
          };
        }
        return {
          state: true,
          data: user,
        };
      } catch (error) {
        this.logger.error(error);
        return {
          state: true,
          data: null,
          message: 'user.passwordmatch-failed',
        };
      }
    } else {
      return {
        state: false,
        data: null,
        message: 'user.update-fail',
      };
    }
  }

  async create(
    createDto: CreateUserDto,
  ): Promise<IServiceResponse<UserEntity>> {
    const user = this.userRepository.create(createDto);
    const result = await this.userRepository.save(user);
    return {
      state: !!result,
      data: result,
      message: 'user.created',
    };
  }

  async update(
    id: string,
    updateDto: UpdateUserDto,
  ): Promise<IServiceResponse<UserEntity | null>> {
    const { state, data: user } = await this.findById(id);
    if (state) {
      Object.assign(user!, updateDto);
      const updatedUser = await this.userRepository.save(user!);
      return {
        state: !!updatedUser,
        data: updatedUser!,
        message: 'user.updated',
      };
    } else {
      return {
        state: false,
        data: null,
        message: 'user.update-fail',
      };
    }
  }

  async remove(id: string) {
    await this.userRepository.softDelete({ id });
    return {
      state: true,
      data: null,
      message: 'user.deleted',
    };
  }
}
