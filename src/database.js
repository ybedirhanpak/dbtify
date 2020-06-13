require("dotenv").config();
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

const queryC = (text, params, callback) => {
  return pool.query(text, params, callback);
};

const queryP = async (text, params) => {
  let result = {
    response: null,
    error: null,
  };

  try {
    const response = await pool.query(text, params);
    result.response = response;
  } catch (error) {
    result.error = error;
  }

  return result;
};

export default {
  queryC,
  queryP,
};
