import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateSpecializationDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  domainId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  studyYears: number;

}
