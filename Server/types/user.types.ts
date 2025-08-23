import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
  //reminder: Case sensitive
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
}

export interface SignupBody {
  username: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}