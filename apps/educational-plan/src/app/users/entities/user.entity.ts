import { Role } from "@educational-plan/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ select: false, default: "" })
  password: string;

  @Column("enum", { enum: Role })
  role: Role;

}
