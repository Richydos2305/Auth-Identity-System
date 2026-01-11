require('dotenv').config();

const config = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: 'mysql'
  },
  production: {
    username: process.env.MYSQL_USER_PRODUCTION,
    password: process.env.MYSQL_PASSWORD_PRODUCTION,
    database: process.env.MYSQL_DATABASE_PRODUCTION,
    host: process.env.MYSQL_HOST_PRODUCTION,
    dialect: 'mysql'
  }
};

module.exports = config;
