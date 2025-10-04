import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany, PrimaryColumn, JoinColumn } from "typeorm";
import { ISeries } from "@educational-plan/types";
import { Course } from "./course.entity";
import { Specialization } from "./specialization.entity";

@Entity()
export class Series implements ISeries {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'uuid' })
  specializationId: string;

  @ManyToOne(() => Specialization, (specialization) => specialization.series, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'specializationId' })
  specialization: Specialization;

  @OneToMany(() => Course, (course) => course.series)
  courses?: Course[];

}
