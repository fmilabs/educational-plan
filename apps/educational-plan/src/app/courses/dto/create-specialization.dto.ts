import { IsNotEmpty } from 'class-validator';

export class CreateSpecializationDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  domainId: string;

}
