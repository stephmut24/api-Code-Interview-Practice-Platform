import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
//import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashPassword } from '@/utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { email } = createUserDto;
      if (await this.emailExists(email)) {
        throw new BadRequestException('User Already Exists');
      }
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashPassword(createUserDto.password),
      });
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async emailExists(email: string): Promise<boolean> {
    return await this.userRepository.exists({ where: { email } });
  }
}
