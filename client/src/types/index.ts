export type Role = 'student' | 'teacher';
export type Progress = 'not-started' | 'in-progress' | 'completed';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  teacherId?: string | null;
}

export interface TaskUser {
  _id: string;
  email: string;
  role: Role;
  teacherId?: string | null;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  progress: Progress;
  ownership?: 'owner' | 'assigned-student';
  createdAt: string;
  userId: TaskUser;
}

