const { Client } = require('pg');

async function main() {
  const connectionString = 'postgresql://postgres:postgres@localhost:5432/zylo?schema=public';
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query('SELECT 1 AS ok');
    console.log('OK', res.rows);
    await client.end();
  } catch (error) {
    console.error('ERROR', error.message);
    if (error.code) console.error('CODE', error.code);
    if (error.detail) console.error('DETAIL', error.detail);
    if (error.hint) console.error('HINT', error.hint);
    await client.end().catch(() => {});
    process.exit(1);
  }
}

main();
