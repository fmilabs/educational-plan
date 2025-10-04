import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min, ValidateIf } from 'class-validator';


export class CreateCourseDto {

  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  credits: number;

  @IsInt()
  @Min(1)
  year: number;

  @IsInt()
  @Min(1)
  semester: number;

  @IsBoolean()
  optional: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ValidateIf(o => o.seriesId !== null)
  maxStudents: number | null;

  @IsNotEmpty()
  @IsUUID()
  specializationId: string;

  @IsOptional()
  @IsUUID()
  @ValidateIf(o => o.seriesId !== null)
  seriesId: string | null;

  userId: string;

}
