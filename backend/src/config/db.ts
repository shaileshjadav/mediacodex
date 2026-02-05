import pg from 'pg';

const { Pool } = pg;
if(!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
};
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
