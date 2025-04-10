import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    version: process.env.POSTGRES_VERSION,
    ssl: true,
  });
  let result = null;
  try {
    await client.connect();
    result = await client.query(queryObject);
  } catch (err) {
    console.error(err);
    throw error;
  } finally {
    await client.end();
    return result;
  }
}

export default {
  query,
};
