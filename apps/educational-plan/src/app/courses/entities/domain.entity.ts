import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { IDomain, StudyForm } from "@educational-plan/types";
import { Specialization } from "./specialization.entity";

@Entity()
export class Domain implements IDomain {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column("enum", { enum: StudyForm })
  studyForm: StudyForm;

  @OneToMany(type => Specialization, specialization => specialization.domain, { eager: true })
  specializations: Specialization[];

}
