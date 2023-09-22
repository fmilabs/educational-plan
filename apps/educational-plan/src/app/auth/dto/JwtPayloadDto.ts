import { Role } from "@educational-plan/types";

export interface JwtPayloadDto {
  email: string;
  role: Role;
  sub: string;
}
