const conn = require("../db/conn.js");
const jwt = require("jsonwebtoken");

const LoginAdmin = async (req, res) => {
    try {
        const user = req.body;

        // console.log(user);
        if (!user.username || !user.password) {
            throw new Error("Please enter valid data!");
        }
        if (user.username == "admin") {
            const data = await conn.query(
                `select * from admin where username='${user.username}'`
            );

            // console.log(data);

            if (data.rowCount <= 0) {
                res.status(404).send({ err: "User not found!" });
                return;
            }

            // console.log(data.rows[0].password);
            if (user.password !== data.rows[0].password) {
                throw new Error("Please enter valid password!");
            }

            const token = await jwt.sign(
                { _id: 21410159 },
                process.env.JWT_TOKEN_KEY
            );

            // console.log(token);

            await conn.query(
                `update admin set token='${token}' where _id=${data.rows[0]._id}`
            );

            res.send({ username: data.rows[0].username, token, role: "admin" });
        } else {
            const data = await conn.query(
                "select * from tblstaff where empid=$1",
                [user.username]
            );

            if (data.rowCount <= 0) {
                res.status(404).send({ err: "User not found!" });
                return;
            }

            if (user.password !== data.rows[0].password) {
                throw new Error("Please enter valid password!");
            }

            const empid = data.rows[0].empid;
            const fname = data.rows[0].fname;
            const dname = data.rows[0].dname;
            const dob = data.rows[0].dob;
            const email = data.rows[0].email;
            const mobile = data.rows[0].mobile;
            const password = data.rows[0].password;

            const token = jwt.sign(
                { _id: data.rows[0].empid },
                process.env.JWT_TOKEN_KEY
            );

            // console.log(token);

            const loginstaffdata = await conn.query(
                "select * from tblstafflogin where empid=$1",
                [user.username]
            );

            // res.send(loginstaffdata);
            if (loginstaffdata.rowCount <= 0) {
                // res.send("HELLO FROM INSERT");

                await conn.query("insert into tblstafflogin values($1,$2)", [
                    user.username,
                    token,
                ]);

                res.send({
                    empid,
                    fname,
                    dname,
                    dob,
                    email,
                    mobile,
                    password,
                    token,
                    role: "user",
                });
            } else {
                await conn.query(
                    "update tblstafflogin set token=$1 where empid=$2",
                    [token, user.username]
                );

                // res.send(setstafftoken);

                res.send({
                    empid,
                    fname,
                    dname,
                    dob,
                    email,
                    mobile,
                    password,
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
            await conn.query(
                "update admin set token='' where _id=$1 and token=$2",
                [req.user[0]._id, req.token]
            );

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

module.exports = { LoginAdmin, LogoutAdmin };
