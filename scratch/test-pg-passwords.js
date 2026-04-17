const { Client } = require('pg');
const passwords = ['postgres', 'password', 'admin', 'admin123', 'root', '123456', '1234', 'postgres1', 'Postgres', '12345', 'qwerty', 'letmein', 'welcome', 'monkey', 'dragon', 'passw0rd', 'abc123', 'iloveyou', 'trustno1', 'sunshine', 'master', 'superman', 'whatever', 'shadow', 'baseball', 'football', 'michael', 'jennifer', 'jordan', 'killer', 'pepper', 'zaq1zaq1', 'qazwsx', 'princess', 'flower', 'tigger', 'summer', 'michael1', 'letmein1', 'welcome1', 'admin1', 'password1', 'root1', '123456789', 'qwerty123', '1q2w3e4r', 'q1w2e3r4', 'zaqwsxedc', 'asdfghjkl', 'zxcvbnm', '123qwe', 'qwe123', 'asd123', '123asd', 'qweasd', 'asdzxc', 'zxcasd', 'qazwsx123', '123qaz', 'qaz123', 'p@ssw0rd', 'p@ssword', 'P@ssw0rd', 'P@ssword', ''];

(async () => {
  for (const pwd of passwords) {
    const client = new Client({ connectionString: `postgresql://postgres:${pwd}@localhost:5432/zylo` });
    try {
      await client.connect();
      const res = await client.query('SELECT 1');
      console.log('GOOD', pwd, res.rows);
      await client.end();
      process.exit(0);
    } catch (err) {
      console.log('BAD', pwd, err.message.replace(/\n/g, ' '));
      await client.end().catch(() => {});
    }
  }
  process.exit(1);
})();
