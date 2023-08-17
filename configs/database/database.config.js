require('dotenv').config();

module.exports = {
  HOST: process.env.DB_HOST,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  DATABASE: process.env.DATABASE,
  DIALECT: process.env.DIALECT,
  POOL: {
    MAX: 5,
    MIN: 0,
    ACQUIRE: 30000,
    IDLE: 10000
  }
};

