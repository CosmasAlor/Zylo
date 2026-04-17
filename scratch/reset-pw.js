const { Client } = require('pg');

async function main() {
  // Connect with the password that works
  const client = new Client({
    connectionString: 'postgresql://postgres:Martha@01142@localhost:5432/zylo'
  });
  try {
    await client.connect();
    await client.query("ALTER USER postgres PASSWORD 'postgres';");
    console.log('OK: postgres password reset to postgres');
    await client.end();
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

main();
