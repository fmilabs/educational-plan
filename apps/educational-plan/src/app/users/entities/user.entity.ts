import { Role } from "@educational-plan/types";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "../../courses/entities/course.entity";

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

  @OneToMany(() => Course, (course) => course.user)
  courses?: Course[];

}
