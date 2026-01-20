import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashPassword } from '@/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@/enums/enums';

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
        role: Role.USER,
      });
      const savedUser = await this.userRepository.save(user);
      return {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
      };
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  async findAll() {
    try {
      const [users, count] = await this.userRepository.findAndCount({
        where: {
          role: Role.USER,
        },
        order: { createdAt: 'DESC' },
      });

      const safeUsers = users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return {
        users: safeUsers,
        count,
      };
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return this.userRepository.findOne({
        where: { email },
        // Important : inclure le password pour la comparaison
        select: ['id', 'email', 'password', 'role', 'lastName', 'firstName'],
      });
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  // users.service.ts
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const userToUpdate = await this.userRepository.findOne({
        where: { id },
      });

      if (!userToUpdate) {
        throw new NotFoundException('User not found');
      }

      // Mettez à jour seulement les champs présents dans updateUserDto
      // (qui n'inclut pas password grâce à OmitType)
      Object.assign(userToUpdate, updateUserDto);

      const updatedUser = await this.userRepository.save(userToUpdate);

      return {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.remove(user);

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw new HttpException(message, 500);
    }
  }

  async emailExists(email: string): Promise<boolean> {
    return await this.userRepository.exists({ where: { email } });
  }
}
