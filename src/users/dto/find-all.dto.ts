import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindAllDto {
  @IsOptional()
  keywords: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit: string;
}
