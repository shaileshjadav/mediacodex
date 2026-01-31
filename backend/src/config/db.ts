import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
});

// optional: print errors
pool.on("error", (err) => {
  console.error("Unexpected PG error", err);
});

// export async function withTransaction(fn: object) {
//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");
//     const result = await fn(client); // pass client to callback
//     await client.query("COMMIT");
//     return result;
//   } catch (err) {
//     await client.query("ROLLBACK");
//     throw err;
//   } finally {
//     client.release();
//   }
// }
