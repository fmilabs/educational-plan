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
  courses?: ICourse[];
}

export interface ICourse {
  id: string;
  name: string;
  credits: number;
  semester: number;
  maxStudents: number | null;
  curriculumPath: string;
  specializations?: ISpecialization[];
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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



