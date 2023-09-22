import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { DomainType, IDomain, StudyForm } from "@educational-plan/types";
import { Specialization } from "./specialization.entity";

@Entity()
export class Domain implements IDomain {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column("enum", { enum: StudyForm })
  studyForm: StudyForm;

  @Column("enum", { enum: DomainType })
  type: DomainType;

  @OneToMany(type => Specialization, specialization => specialization.domain, { eager: true })
  specializations: Specialization[];

}
