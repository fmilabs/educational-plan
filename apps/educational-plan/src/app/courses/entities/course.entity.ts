import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { ICourse } from "@educational-plan/types";
import { Specialization } from "./specialization.entity";

@Entity()
export class Course implements ICourse {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  credits: number;

  @Column()
  year: number;

  @Column()
  semester: number;

  @Column({ nullable: true })
  maxStudents: number | null;

  @Column({ nullable: true })
  curriculumPath: string | null;

  @ManyToMany(() => Specialization)
  @JoinTable()
  specializations?: Specialization[];

}
