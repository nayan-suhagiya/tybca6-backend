const conn = require("../db/conn");
const jwt = require("jsonwebtoken");

const authAdmin = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const verify = jwt.verify(token, process.env.JWT_TOKEN_KEY);

        const data = await conn.query(
            `select * from admin where _id=${verify._id} and token='${token}'`
        );

        if (!data) {
            return res.status(401).send({ err: "Please authenticate!" });
        }

        req.user = data.rows;
        req.token = token;

        // res.send();
        next();
    } catch (err) {
        res.status(401).send({ err: "Please authenticate!" });
    }
};

module.exports = authAdmin;
