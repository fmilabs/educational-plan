import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';


export class CreateCourseDto {

  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  credits: number;

  @IsNumber()
  @Min(1)
  year: number;

  @IsNumber()
  @Min(1)
  semester: number;

  maxStudents: number | null;

  @IsNotEmpty()
  @IsUUID()
  specializationId: string;

  userId: string;

}
