import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Domain } from "./domain.entity";
import { ISpecialization } from "@educational-plan/types";

@Entity()
export class Specialization implements ISpecialization {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Domain, (domain) => domain.specializations, { onDelete: 'CASCADE' })
  domain: Domain;

}
