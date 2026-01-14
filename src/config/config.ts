import dotenv from 'dotenv';
dotenv.config();

export const config = () => {
  return {
    port: process.env.PORT,
    db_name: process.env.DB_NAME,
    db_username: process.env.DB_USERNAME,
    db_password: process.env.DB_PASSWORD,
    db_port: process.env.DB_PORT,
  };
};
