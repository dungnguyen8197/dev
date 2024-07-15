import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { FindPurchaseByIdResponse } from '../purchases/dto/find.dto';
import {
  PurchaseRequest,
  PurchaseResponse,
} from '../purchases/dto/register.dto';
import { PurchasesService } from './purchases.service';
import { JwtPayload } from 'src/auth/jwt.strategy';

@Controller()
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post('api/v1/purchases')
  @ApiOperation({
    tags: ['purchases'],
    summary: '/api/v1/purchases',
    description: 'Create new purchases',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: PurchaseResponse })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async create(
    @Request() req: { user: JwtPayload },
    @Body() purchaseRequest: PurchaseRequest,
  ) {
    return await this.purchasesService.create(req.user, purchaseRequest);
  }

  @Get('api/v1/purchases/:purchase_id')
  @ApiOperation({
    tags: ['purchases'],
    summary: '/api/v1/purchases/{purchase_id}',
    description: 'Get purchase',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: FindPurchaseByIdResponse })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async find(
    @Request() req: { user: JwtPayload },
    @Param('purchase_id', new ParseIntPipe()) purchase_id,
  ) {
    return await this.purchasesService.getPurchaseDetail(req.user, purchase_id);
  }
}
