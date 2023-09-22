import { IsNotEmpty } from 'class-validator';

export class UpdateSpecializationDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  domainId: string;

}
