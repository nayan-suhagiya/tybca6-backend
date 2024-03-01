const conn = require("../db/conn");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const verify = jwt.verify(token, "secret-key-for-generate-auth-token");

    if (verify._id == 21410159) {
      const data = await conn.query("select * from admin where _id=$1", [
        verify._id,
      ]);

      if (data.rowCount <= 0) {
        return res.status(401).send({ err: "Please authenticate!" });
      }

      req.user = data.rows;
      req.token = token;

      next();
      return;
    }

    const stafflogindata = await conn.query(
      "select * from tblstafflogin where empid=$1 and token=$2",
      [verify._id, token]
    );

    if (stafflogindata.rowCount <= 0) {
      return res.status(401).send({ err: "Please authenticate!" });
    }

    req.user = stafflogindata.rows;
    req.token = token;

    next();
  } catch (err) {
    res.status(401).send({ err: "Please authenticate!" });
  }
};

module.exports = auth;
