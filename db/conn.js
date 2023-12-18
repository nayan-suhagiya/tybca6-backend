const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.PUSER,
  host: process.env.PHOST,
  database: process.env.PDATABASE,
  password: process.env.PPASSWORD,
  port: process.env.PPORT,
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
