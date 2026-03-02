import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // your password if any
  database: 'mustard_seed_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});