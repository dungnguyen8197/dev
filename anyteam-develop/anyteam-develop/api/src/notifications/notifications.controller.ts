import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';
import { NotificationReadRequest } from './dto/read.dto';
import { NotificationsService } from './notifications.service';

type PasswordOmitUser = Omit<User, 'password'>;

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsSerice: NotificationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('api/v1/notification/reads')
  @ApiOperation({
    tags: ['notification'],
    summary: '/api/v1/notification/reads',
    description: 'Get read notification id list.'
  })
  async findByUser(@Request() strategyReq: { user: PasswordOmitUser }) {
    return await this.notificationsSerice.findByUser(strategyReq.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('api/v1/notification/read')
  @ApiOperation({
    tags: ['notification'],
    summary: '/api/v1/notification/read',
    description: 'Post read notification id.'
  })
  async read(
    @Body() req: NotificationReadRequest,
    @Request() strategyReq: { user: PasswordOmitUser }
  ) {
    return await this.notificationsSerice.create(req.notification_id, strategyReq.user);
  }
}
