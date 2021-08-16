const { Pool } = require('pg');

const config = process.env.pgConfig ? JSON.parse(process.env.pgConfig) : {};

const pool = new Pool({
  ...config,
  connectionTimeoutMillis: 3000
});

export const createTransaction = async () => {
  let client = await pool.connect();
  const begin = () => client.query('begin');
  const rollback = () => client.query('rollback');
  const commit = () => client.query('commit');
  const release = () => client.release();
  const query = async (sql, params) => {
    const data = await client.query(sql, params);
    return data.rows;
  }

  return {
    begin,
    rollback,
    commit,
    query,
    release
  }
}

export const query = async (sql, params) => {
  const data = await pool.query(sql, params);
  return data.rows;
};