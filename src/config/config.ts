import 'dotenv/config'
import path from 'path'

export interface Env {
  PORT: number;
  NODE_ENV: 'development' | 'production';
  isDev: boolean;
  LogDir: string;
}

export const env: Env = {
  PORT: parseInt(process.env.PORT || '3000'),
  NODE_ENV: (process.env.NODE_ENV as any) || 'development',
  isDev: (process.env.NODE_ENV as any) === 'development',
  LogDir: process.env.LogDir as string || path.join(__dirname, '../../logs/')
}