import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Domain } from "./domain.entity";
import { ISpecialization } from "@educational-plan/types";
import { Course } from "./course.entity";
import { Series } from "./series.entity";

@Entity()
export class Specialization implements ISpecialization {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  studyYears: number;

  @ManyToOne(() => Domain, (domain) => domain.specializations, { onDelete: 'CASCADE', eager: true })
  domain: Domain;

  @OneToMany(() => Series, (series) => series.specialization, { cascade: true, eager: true })
  series: Series[];

  @OneToMany(() => Course, (course) => course.specialization)
  courses?: Course[];

}
