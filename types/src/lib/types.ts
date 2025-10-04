export type Paginated<T> = {
  data: T[];
  count: number;
}

export enum StudyForm {
  IF = 'IF',
  ID = 'ID',
  IFR = 'IFR',
}

export enum DomainType {
  Bachelor = 'bachelor',
  Master = 'master',
}

export interface IDomain {
  id: string;
  name: string;
  studyForm: StudyForm;
  type: DomainType;
  specializations?: ISpecialization[];
}

export interface ISpecialization {
  id: string;
  name: string;
  studyYears: number;
  domain: IDomain;
  series: ISeries[];
  courses?: ICourse[];
}

export interface ISeries {
  id: string;
  number: number;
  specializationId: string;
  specialization: ISpecialization;
  courses?: ICourse[];
}

export interface ICourse {
  id: string;
  name: string;
  credits: number;
  year: number;
  semester: number;
  optional: boolean;
  maxStudents: number | null;
  curriculumPath: string;
  specialization: ISpecialization;
  series: ISeries | null;
  user: IUser;
  createdAt: Date | string;
  updatedAt: Date | string;
  curriculumUpdatedAt: Date | string;
  isOutdated: boolean;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: Role;
}

export enum Role {
  Admin = 'admin',
  Teacher = 'teacher',
}

export interface JwtPayload extends IUser {
  iat: number;
  exp: number;
}

export interface AuthResponse {
  accessToken: string;
  user: IUser;
}

export const DOMAIN_TYPES = {
  [DomainType.Bachelor]: 'Licență',
  [DomainType.Master]: 'Master',
} as const;

export const STUDY_FORMS = {
  [StudyForm.IF]: 'Învățământ cu frecvență',
  [StudyForm.ID]: 'Învățământ la distanță',
  [StudyForm.IFR]: 'Învățământ cu frecvență redusă',
} as const;

export const ROLES = {
  [Role.Admin]: 'Administrator',
  [Role.Teacher]: 'Profesor',
} as const;
