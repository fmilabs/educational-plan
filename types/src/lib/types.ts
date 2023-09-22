export interface Domain {
  id: string;
  name: string;
  specializations?: Specialization[];
}

export interface Specialization {
  id: string;
  name: string;
  courses?: Course[];
}

export interface Course {
  id: string;
  name: string;
  credits: number;
  semester: number;
  maxStudents: number;
  curriculumPath: string;
  specializations?: Specialization[];
}

export interface User {
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





