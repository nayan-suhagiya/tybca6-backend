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

            const token = jwt.sign(
                { _id: data.rows[0].empid },
                process.env.JWT_TOKEN_KEY
            );

            // console.log(token);
            const empid = data.rows[0].empid;
            const fname = data.rows[0].fname;
            const dname = data.rows[0].dname;
            const dob = data.rows[0].dob;
            const email = data.rows[0].email;
            const mobile = data.rows[0].mobile;
            const password = data.rows[0].password;

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
    } catch (err) {
        res.status(400).send({ err: err.message });
    }
};
const LogoutAdmin = async (req, res) => {
    try {
        await conn.query(
            `update admin set token='' where token='${req.token}'`
        );

        res.send();
    } catch (err) {
        res.status(400).send({ err: err.message });
    }
};

module.exports = { LoginAdmin, LogoutAdmin };
