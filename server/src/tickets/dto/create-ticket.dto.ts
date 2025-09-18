import { IsEnum, IsOptional, IsString, IsArray, IsEmail } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  code: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
  status?: string;

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  priority?: string;

  @IsOptional()
  @IsEmail()
  assigneeEmail?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
