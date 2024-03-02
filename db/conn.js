const Pool = require("pg").Pool;

const pool = new Pool({
  user: "bhavin",
  host: "ep-bitter-snow-a46c9uxr.us-east-1.aws.neon.tech",
  database: "office_management",
  password: "aWQ58VTHwurS",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err) => {
  if (err) {
    console.log({ err: err.message });
    return;
  }

  console.log("connection success!");
});

module.exports = pool;
