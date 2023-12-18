const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

pool.connect((err) => {
  if (err) {
    console.log({ err: err.message });
    return;
  }

  console.log("connection success!");
});

module.exports = pool;
``;
