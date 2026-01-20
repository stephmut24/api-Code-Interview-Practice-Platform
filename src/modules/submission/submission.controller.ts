import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { SubmissionsService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guard/auth.guard';
import { CurrentUser } from '@/common/decorator/current-user.decorator';
import type { CurrentUserType } from '@/types';

@Controller('submissions')
@ApiTags('Submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  submit(
    @Body() createSubmissionDto: CreateSubmissionDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.submissionsService.submit(createSubmissionDto, currentUser.sub);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.submissionsService.findById(id);
  }
}
