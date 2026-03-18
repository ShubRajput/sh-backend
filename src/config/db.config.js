import mysql from 'mysql2/promise';

import EnvData from './env.config.js';

const pool = mysql.createPool({
  host: EnvData.DB_HOST,
  user: EnvData.DB_USER,
  password: EnvData.DB_PASSWORD,
  database: EnvData.DB_NAME,
  typeCast: function (field, next) {
    if (field.type === "DATE") {
      return field.string(); // Return as string without time
    }
    if (field.type === "TINY" && field.length === 1) {
      const value = field.string();
      return value === "1"; // Convert to boolean
    }

    if (field.type === "NEWDECIMAL") {
      return parseFloat(field.string());
    }
    return next();
  },
});

export default pool;
