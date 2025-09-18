import { IsEmail, IsEnum, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListQueryDto {
  @IsOptional()
  @IsEnum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
  status?: string;

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  priority?: string;

  @IsOptional()
  @IsEmail()
  assigneeEmail?: string;

  // áp dụng cho title / description / tags
  @IsOptional()
  @IsString()
  search?: string;

  // keyset pagination: _id của item cuối trang trước
  @IsOptional()
  @IsString()
  cursor?: string;

  // giới hạn (tối đa 50)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
