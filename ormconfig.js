const path = require('path');

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, 'dist/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'dist/migrations/*{.ts,.js}')],
  cli: {
    migrationsDir: 'src/migrations',
  },
  ...(process.env.NODE_ENV === 'production' && {
    ssl: { rejectUnauthorized: false }
  }),
};