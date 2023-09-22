import { DomainType, StudyForm } from '@educational-plan/types';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class CreateDomainDto {

  @IsNotEmpty()
  name: string;

  @IsEnum(StudyForm)
  studyForm: StudyForm;

  @IsEnum(DomainType)
  type: DomainType;

}
