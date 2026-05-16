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
  password?: string;
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

export interface AppNotification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  relatedId?: string; // id of the schedule or other entity
  targetRole?: UserRole;
  targetUserId?: string;
}

export const MOCK_USERS: User[] = [
  { id: 'admin-1', name: 'Admin EMIT', email: 'admin@emit.mg', role: UserRole.ADMIN },
  { id: 'teacher-1', name: 'M. Ali', email: 'ali@emit.mg', role: UserRole.TEACHER },
  { id: 'teacher-2', name: 'Mme Sara', email: 'sara@emit.mg', role: UserRole.TEACHER },
];

export const MOCK_ROOMS: Room[] = [
  { id: 'b101', name: 'B101', capacity: 40, type: 'TD' },
  { id: 'b102', name: 'B102', capacity: 40, type: 'TD' },
  { id: 'b103', name: 'B103', capacity: 40, type: 'TD' },
  { id: 'b201', name: 'B201', capacity: 40, type: 'TD' },
  { id: 'b202', name: 'B202', capacity: 40, type: 'TD' },
  { id: 'b203', name: 'B203', capacity: 40, type: 'TD' },
  { id: 'b301', name: 'B301', capacity: 40, type: 'TD' },
  { id: 'b302', name: 'B302', capacity: 40, type: 'TD' },
  { id: 'b303', name: 'B303', capacity: 40, type: 'TD' },
  { id: 'b401', name: 'B401', capacity: 40, type: 'TD' },
  { id: 'b402', name: 'B402', capacity: 40, type: 'TD' },
  { id: 'b403', name: 'B403', capacity: 40, type: 'TD' },
  { id: 'a001', name: 'A001', capacity: 60, type: 'TD' },
  { id: 'a002', name: 'A002', capacity: 60, type: 'TD' },
  { id: 'amphi', name: 'AMPHI', capacity: 200, type: 'Amphi' },
  { id: '3d', name: '3D', capacity: 50, type: 'TP' },
  { id: 'coo1', name: 'COO1', capacity: 30, type: 'TP' },
  { id: 'coo2', name: 'COO2', capacity: 30, type: 'TP' },
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 't1', name: 'Mme Josée', email: 'josee@emit.mg', department: 'Langues', password: 'password123' },
  { id: 't2', name: 'Dr RAOJERY', email: 'raojery@emit.mg', department: 'Management', password: 'password123' },
  { id: 't3', name: 'Mr Valérien', email: 'valerien@emit.mg', department: 'Informatique', password: 'password123' },
  { id: 't4', name: 'Dr Jacques Aimé', email: 'jacques@emit.mg', department: 'Informatique', password: 'password123' },
  { id: 't5', name: 'Dr Brice', email: 'brice@emit.mg', department: 'Informatique', password: 'password123' },
  { id: 't6', name: 'Mr BAKARI', email: 'bakari@emit.mg', department: 'Informatique', password: 'password123' },
  { id: 't7', name: 'Dr Hery', email: 'hery@emit.mg', department: 'Informatique', password: 'password123' },
  { id: 't8', name: 'Mr Fanomezana', email: 'fanomezana@emit.mg', department: 'Informatique', password: 'password123' },
];

export const MOCK_CLASSES: Class[] = [
  { id: 'l1-info', name: 'L1', level: Level.LICENCE, mention: 'Informatique' },
  { id: 'l2-info', name: 'L2', level: Level.LICENCE, mention: 'Informatique' },
  { id: 'l3-info', name: 'L3', level: Level.LICENCE, mention: 'Informatique' },
  { id: 'l1-mgmt', name: 'L1', level: Level.LICENCE, mention: 'Management' },
  { id: 'l2-mgmt', name: 'L2', level: Level.LICENCE, mention: 'Management' },
  { id: 'l3-mgmt', name: 'L3', level: Level.LICENCE, mention: 'Management' },
  { id: 'm1-mgmt', name: 'M1', level: Level.MASTER, mention: 'Management' },
  { id: 'm2-mgmt', name: 'M2', level: Level.MASTER, mention: 'Management' },
];

export const MOCK_SUBJECTS: Subject[] = [
  { id: 's1', name: 'Anglais', code: 'ANG1' },
  { id: 's2', name: 'COE', code: 'COE1' },
  { id: 's3', name: 'Dev Application Mobile', code: 'DAM1' },
  { id: 's4', name: 'JS Avancé', code: 'JSA1' },
  { id: 's5', name: 'ASP Net', code: 'ASP1' },
  { id: 's6', name: 'CPI', code: 'CPI1' },
  { id: 's7', name: 'JAVA WEB', code: 'JW1' },
  { id: 's8', name: 'ALGEBRE', code: 'ALG1' },
];

export const MOCK_SCHEDULES: Schedule[] = [
  // Lundi
  { id: 'sch-1', classId: 'l3-info', subjectId: 's1', teacherId: 't1', roomId: 'b101', day: 0, startTime: '10:00', endTime: '12:00', status: 'validated' },
  { id: 'sch-2', classId: 'l3-info', subjectId: 's2', teacherId: 't2', roomId: 'amphi', day: 0, startTime: '14:00', endTime: '17:00', status: 'validated' },
  // Mardi
  { id: 'sch-3', classId: 'l3-info', subjectId: 's3', teacherId: 't3', roomId: 'b201', day: 1, startTime: '08:00', endTime: '11:00', status: 'validated' },
  { id: 'sch-4', classId: 'l3-info', subjectId: 's4', teacherId: 't4', roomId: 'coo1', day: 1, startTime: '14:00', endTime: '18:00', status: 'validated' },
  // Mercredi
  { id: 'sch-5', classId: 'l3-info', subjectId: 's5', teacherId: 't5', roomId: 'b301', day: 2, startTime: '08:00', endTime: '10:00', status: 'validated' },
  { id: 'sch-6', classId: 'l3-info', subjectId: 's6', teacherId: 't6', roomId: 'coo2', day: 2, startTime: '10:00', endTime: '12:00', status: 'validated' },
  // Jeudi
  { id: 'sch-7', classId: 'l3-info', subjectId: 's3', teacherId: 't3', roomId: 'b102', day: 3, startTime: '07:00', endTime: '10:00', status: 'validated' },
  { id: 'sch-8', classId: 'l3-info', subjectId: 's7', teacherId: 't7', roomId: 'amphi', day: 3, startTime: '10:00', endTime: '12:00', status: 'validated' },
  { id: 'sch-9', classId: 'l3-info', subjectId: 's2', teacherId: 't2', roomId: 'amphi', day: 3, startTime: '14:00', endTime: '17:00', status: 'validated' },
  // Vendredi
  { id: 'sch-10', classId: 'l3-info', subjectId: 's8', teacherId: 't8', roomId: 'b103', day: 4, startTime: '07:00', endTime: '12:00', status: 'validated' },
];
