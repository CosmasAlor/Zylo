require('dotenv/config');
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query('SELECT 1 AS ok');
    console.log('OK', JSON.stringify(res.rows));
    await client.end();
  } catch (error) {
    console.error('ERROR', error.message);
    process.exit(1);
  }
}

main();
