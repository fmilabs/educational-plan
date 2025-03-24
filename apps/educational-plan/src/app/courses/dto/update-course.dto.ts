import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';


export class UpdateCourseDto {

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

  @IsBoolean()
  optional: boolean;

  @IsOptional()
  maxStudents: number | null;

  @IsNotEmpty()
  @IsUUID()
  specializationId: string;

  userId: string;

}
