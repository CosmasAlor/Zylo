require('dotenv/config');
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.query("ALTER USER postgres PASSWORD 'postgres';");
    console.log('PASSWORD_CHANGED');
    await client.end();
  } catch (error) {
    console.error('ERROR', error.message);
    process.exit(1);
  }
}

main();
