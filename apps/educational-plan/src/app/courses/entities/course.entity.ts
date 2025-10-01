import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ICourse } from "@educational-plan/types";
import { Specialization } from "./specialization.entity";
import { User } from "../../users/entities/user.entity";
import { Expose } from "class-transformer";

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

  @Column()
  optional: boolean;

  @Column({ nullable: true })
  maxStudents: number | null;

  @Column({ nullable: true })
  curriculumPath: string | null;

  @ManyToOne(() => Specialization, (specialization) => specialization.courses, { onDelete: 'CASCADE', eager: true })
  specialization: Specialization;

  @ManyToOne(() => User, (user) => user.courses, { onDelete: 'CASCADE', eager: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  curriculumUpdatedAt: Date;

  @Expose()
  get isOutdated(): boolean {
    const outdatedBefore = process.env.COURSES_OUTDATED_BEFORE ? new Date(process.env.COURSES_OUTDATED_BEFORE) : null;
    return !this.curriculumPath || (outdatedBefore && (this.curriculumUpdatedAt < outdatedBefore || this.updatedAt < outdatedBefore));
  }

}
