import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Domain } from "./domain.entity";
import { ISpecialization } from "@educational-plan/types";
import { Course } from "./course.entity";

@Entity()
export class Specialization implements ISpecialization {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  studyYears: number;

  @ManyToOne(() => Domain, (domain) => domain.specializations, { onDelete: 'CASCADE' })
  domain: Domain;

  @ManyToMany(() => Course)
  courses: Course[];

}
