import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres123',
  port: 5432,
});

const query = (text, params, callback) => {
  return pool.query(text, params, callback);
};

export default {
  query,
};
