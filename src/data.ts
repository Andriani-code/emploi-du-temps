export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export enum Level {
  LICENCE = 'Licence',
  MASTER = 'Master'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: 'TD' | 'TP' | 'Amphi';
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface Class {
  id: string;
  name: string; // e.g., L1, L2, M1
  level: Level;
  mention: string; // e.g., Informatique, Gestion
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Schedule {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId: string;
  day: number; // 0-5 (Mon-Sat)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: 'pending' | 'validated' | 'rejected';
  originalDay?: number;
  originalStartTime?: string;
  originalEndTime?: string;
}

export const MOCK_USERS: User[] = [
  { id: 'admin-1', name: 'Admin EMIT', email: 'admin@emit.mg', role: UserRole.ADMIN },
  { id: 'teacher-1', name: 'M. Ali', email: 'ali@emit.mg', role: UserRole.TEACHER },
  { id: 'teacher-2', name: 'Mme Sara', email: 'sara@emit.mg', role: UserRole.TEACHER },
];

export const MOCK_ROOMS: Room[] = [
  { id: 'a1', name: 'A1', capacity: 100, type: 'Amphi' },
  { id: 'b2', name: 'B2', capacity: 40, type: 'TD' },
  { id: 'c3', name: 'C3', capacity: 60, type: 'TP' },
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 't1', name: 'M. Ali', email: 'ali@emit.mg', department: 'Informatique' },
  { id: 't2', name: 'Mme Sara', email: 'sara@emit.mg', department: 'Gestion' },
  { id: 't3', name: 'M. Karim', email: 'karim@emit.mg', department: 'Réseaux' },
];

export const MOCK_CLASSES: Class[] = [
  { id: 'l1-info', name: 'L1', level: Level.LICENCE, mention: 'Informatique' },
  { id: 'l2-info', name: 'L2', level: Level.LICENCE, mention: 'Informatique' },
  { id: 'm1-mgmt', name: 'M1', level: Level.MASTER, mention: 'Management' },
];

export const MOCK_SUBJECTS: Subject[] = [
  { id: 's1', name: 'Algorithmique', code: 'INF101' },
  { id: 's2', name: 'Base de données', code: 'INF201' },
  { id: 's3', name: 'Réseaux', code: 'INF301' },
];

export const MOCK_SCHEDULES: Schedule[] = [
  { id: 'sch-1', classId: 'l2-info', subjectId: 's1', teacherId: 't1', roomId: 'b2', day: 0, startTime: '08:00', endTime: '10:00', status: 'validated' },
  { id: 'sch-2', classId: 'm1-mgmt', subjectId: 's2', teacherId: 't2', roomId: 'c3', day: 0, startTime: '10:15', endTime: '12:15', status: 'validated' },
  { id: 'sch-3', classId: 'l3-info', subjectId: 's3', teacherId: 't3', roomId: 'a1', day: 0, startTime: '13:30', endTime: '15:30', status: 'pending' },
];
