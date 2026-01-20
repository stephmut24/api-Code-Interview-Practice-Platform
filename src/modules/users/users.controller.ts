import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '@/common/decorator/role.decorator';
import { Role } from '@/enums/enums';
import { AuthGuard } from '@/common/guard/auth.guard';
import { CurrentUser } from '@/common/decorator/current-user.decorator';
import type { CurrentUserType } from '@/types';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    if (currentUser.role !== Role.ADMIN && currentUser.sub !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.usersService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    // User peut modifier son propre profil, Admin peut modifier tous les profils
    if (currentUser.role !== Role.ADMIN && currentUser.sub !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    if (currentUser.role !== Role.ADMIN && updateUserDto.role) {
      delete updateUserDto.role;
    }

    return this.usersService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
