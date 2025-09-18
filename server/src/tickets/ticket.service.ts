import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ticket, TicketDocument } from './ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ListQueryDto } from './dto/list-query.dto';

@Injectable()
export class TicketService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>) {}

  async create(dto: CreateTicketDto) {
    const created = new this.ticketModel(dto);
    return created.save();
  }

  async findAll(q: ListQueryDto) {
    const filter: any = {};
    if (q.status) filter.status = q.status;
    if (q.priority) filter.priority = q.priority;
    if (q.assigneeEmail) filter.assigneeEmail = q.assigneeEmail;

    if (q.search) {
      const rx = new RegExp(q.search, 'i');
      filter.$or = [{ title: rx }, { description: rx }, { tags: rx }];
    }

    // keyset: _id < cursor (đang sort desc)
    if (q.cursor) {
      if (Types.ObjectId.isValid(q.cursor)) {
        filter._id = { $lt: new Types.ObjectId(q.cursor) };
      }
    }

    const limit = Math.min(q.limit ?? 20, 50);
    const items = await this.ticketModel
      .find(filter)
      .sort({ _id: -1 })
      .limit(limit)
      .exec();

  const nextCursor = items.length === limit ? (items[items.length - 1]._id as Types.ObjectId).toString() : null;
    return { items, nextCursor };
  }

  async findOne(id: string) {
    const doc = await this.ticketModel.findById(id);
    if (!doc) throw new NotFoundException('Ticket not found');
    return doc;
  }

  async update(id: string, dto: UpdateTicketDto) {
    const updated = await this.ticketModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Ticket not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.ticketModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Ticket not found');
    return { message: 'Deleted' };
  }
}
