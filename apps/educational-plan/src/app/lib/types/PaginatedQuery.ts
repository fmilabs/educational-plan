import { Type } from "class-transformer";
import { IsNumber, IsNumberString, IsOptional, Min } from "class-validator";

export class PaginatedQuery {
  
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}