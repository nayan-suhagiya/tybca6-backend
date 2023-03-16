const conn = require("../db/conn");
const moment = require("moment");

const checkIn = async (req, res) => {
    try {
        const data = req.body;
        // console.log(data.checkIn);
        // console.log(data.empid);
        // console.log(req.token);

        checkinDate = new Date();

        const insertData = await conn.query(
            `insert into tblstaffcheckin values ($1,$2,$3)`,
            [data.empid, req.token, checkinDate]
        );

        // res.send(insertData);

        if (insertData.rowCount <= 0) {
            res.status(400).send();
            return;
        }

        res.send({ present: true, empid: data.empid, checkinDate });
    } catch (error) {
        res.status(400).send({ error });
    }
};

const checkOut = async (req, res) => {};

module.exports = { checkIn, checkOut };
