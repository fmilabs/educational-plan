import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateSpecializationDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  domainId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  studyYears: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  series: number[] = [];

}
