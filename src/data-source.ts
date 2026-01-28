// src/data-source.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

// Charge le .env
config();

// Configuration simple
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Entities
  entities: [path.join(__dirname, '**/*.entity{.ts,.js}')],

  // Migrations
  migrations: [path.join(__dirname, 'migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',

  synchronize: false,
  logging: true,
});

export default dataSource;
