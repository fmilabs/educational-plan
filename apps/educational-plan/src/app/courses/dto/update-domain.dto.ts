import { StudyForm } from '@educational-plan/types';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateDomainDto {

  @IsNotEmpty()
  name: string;

  @IsEnum(StudyForm)
  studyForm: StudyForm;

}
