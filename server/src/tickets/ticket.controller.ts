import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ListQueryDto } from './dto/list-query.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard) // tất cả route cần authenticated
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // chỉ ADMIN được tạo
  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateTicketDto) {
    return this.ticketService.create(dto);
  }

  // USER / ADMIN đều xem
  @Get()
  findAll(@Query() query: ListQueryDto) {
    return this.ticketService.findAll(query);
  }

  // USER / ADMIN đều xem
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  // chỉ ADMIN cập nhật
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.ticketService.update(id, dto);
  }

  // chỉ ADMIN xoá
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }
}
