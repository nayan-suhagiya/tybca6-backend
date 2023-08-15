const Pool = require("pg").Pool;

const pool = new Pool({
  user: "nayan",
  host: "localhost",
  database: "office_management",
  password: "2013",
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.log({ err: err.message });
    return;
  }

  console.log("connection success!");
});

module.exports = pool;
