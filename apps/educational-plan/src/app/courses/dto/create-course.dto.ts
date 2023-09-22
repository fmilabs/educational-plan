import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, Min } from 'class-validator';


export class CreateCourseDto {

  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  credits: number;

  @IsNumber()
  @Min(1)
  semester: number;

  maxStudents: number | null;

  @IsArray()
  @ArrayNotEmpty()
  specializationIds: string[];

}
