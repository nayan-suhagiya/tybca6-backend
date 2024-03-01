const conn = require("../db/conn.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "theteamproject06@gmail.com",
    pass: "pvap eziu zthz syru",
  },
});

const LoginAdmin = async (req, res) => {
  try {
    const user = req.body;

    if (!user.username || !user.password) {
      throw new Error("Please enter valid data!");
    }
    if (user.username == "admin") {
      const data = await conn.query(
        `select * from admin where username='${user.username}'`
      );

      if (data.rowCount <= 0) {
        res.status(404).send({ err: "User not found!" });
        return;
      }

      if (user.password !== data.rows[0].password) {
        throw new Error("Please enter valid password!");
      }

      const token = await jwt.sign(
        { _id: 21410159 },
        "secret-key-for-generate-auth-token"
      );

      await conn.query(
        `update admin set token='${token}' where _id=${data.rows[0]._id}`
      );

      res.send({ username: data.rows[0].username, token, role: "admin" });
    } else {
      const data = await conn.query("select * from tblstaff where empid=$1", [
        user.username,
      ]);

      if (data.rowCount <= 0) {
        res.status(404).send({ err: "User not found!" });
        return;
      }

      if (user.password !== data.rows[0].password) {
        throw new Error("Please enter valid password!");
      }

      const sendingData = data.rows[0];

      const token = jwt.sign(
        { _id: data.rows[0].empid },
        "secret-key-for-generate-auth-token"
      );

      const loginstaffdata = await conn.query(
        "select * from tblstafflogin where empid=$1",
        [user.username]
      );

      if (loginstaffdata.rowCount <= 0) {
        await conn.query("insert into tblstafflogin values($1,$2)", [
          user.username,
          token,
        ]);

        res.send({
          empid: sendingData.empid,
          fname: sendingData.fname,
          gender: sendingData.gender,
          dname: sendingData.dname,
          email: sendingData.email,
          mobile: sendingData.mobile,
          dob: sendingData.dob,
          jdate: sendingData.jdate,
          city: sendingData.city,
          state: sendingData.state,
          address: sendingData.address,
          deptid: sendingData.deptid,
          profile: sendingData.profile,
          bankname: sendingData.bankname,
          accountnumber: sendingData.accountnumber,
          ifsccode: sendingData.ifsccode,
          token,
          role: "user",
        });
      } else {
        await conn.query("update tblstafflogin set token=$1 where empid=$2", [
          token,
          user.username,
        ]);

        res.send({
          empid: sendingData.empid,
          fname: sendingData.fname,
          gender: sendingData.gender,
          dname: sendingData.dname,
          email: sendingData.email,
          mobile: sendingData.mobile,
          dob: sendingData.dob,
          jdate: sendingData.jdate,
          city: sendingData.city,
          state: sendingData.state,
          address: sendingData.address,
          deptid: sendingData.deptid,
          profile: sendingData.profile,
          bankname: sendingData.bankname,
          accountnumber: sendingData.accountnumber,
          ifsccode: sendingData.ifsccode,
          token,
          role: "user",
        });
      }
    }
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
};

const LogoutAdmin = async (req, res) => {
  try {
    if (req.user[0]._id) {
      await conn.query("update admin set token='' where _id=$1 and token=$2", [
        req.user[0]._id,
        req.token,
      ]);

      res.send();
      return;
    }

    await conn.query(
      "update tblstafflogin set token='' where empid=$1 and token=$2",
      [req.user[0].empid, req.token]
    );

    res.send();
    return;
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
};

const UpdateAdminPassword = async (req, res) => {
  try {
    const updateData = await conn.query(
      "update admin set password=$1 where username=$2",
      [req.body.password, "admin"]
    );

    if (updateData.rowCount <= 0) {
      return res.status(400).send({ err: "unable to update!" });
    }

    res.send({ updated: true });
  } catch (err) {
    res.status(400).send({ err });
  }
};

const sendForgotMail = async (req, res) => {
  try {
    empid = req.body.empid;

    const findData = await conn.query("select * from tblstaff where empid=$1", [
      empid,
    ]);

    if (findData.rowCount <= 0) {
      res.send({ userFound: false });
      return;
    }

    const data = findData.rows[0];

    const mailOptions = {
      from: "nickpatel734@gmail.com",
      to: `${data.email}`,
      subject: "OFFICE MANAGEMENT SYSTEM-oms@admin.com",
      text: `Hello ${data.fname}`,
      html: `<h4>Your password is "${data.password}"</h4>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(error.message);
      }
      res.send({ mailSend: true });
    });
  } catch (error) {
    res.status(400).send({ error });
  }
};

module.exports = {
  LoginAdmin,
  LogoutAdmin,
  UpdateAdminPassword,
  sendForgotMail,
};
