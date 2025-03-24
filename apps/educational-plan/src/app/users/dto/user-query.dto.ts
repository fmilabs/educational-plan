import { IsOptional, IsString } from "class-validator";
import { PaginatedQuery } from "../../lib/types/PaginatedQuery";

export class UserQueryDto extends PaginatedQuery {
  @IsOptional()
  @IsString()
  email?: string;
}
