import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { Region } from '../region';
import { Settlement } from '../settlement';

dotenv.config();

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 3090),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Region, Settlement],
  synchronize: process.env.NODE_ENV?.toLowerCase() === 'development',
};
