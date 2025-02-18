const path = require('path');
const dotenv = require('dotenv');

// Определяем, какой .env файл использовать
const envPath = process.env.NODE_ENV 
  ? path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
  : path.resolve(process.cwd(), '.env.development');

// Загружаем переменные окружения из соответствующего файла
dotenv.config({ path: envPath });

module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRESS_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB || 'wateres',
    migrationStorageTableName: 'sequelize_meta',
    seederStorageTableName: 'sequelize_data',
    logging: console.log,
    define: {
      timestamps: true
    }
  },
  production: {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRESS_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  }
}; 