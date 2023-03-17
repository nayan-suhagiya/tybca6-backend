const conn = require("../db/conn");
const moment = require("moment");

const checkIn = async (req, res) => {
    try {
        const data = req.body;
        checkinDate = new Date();

        const insertData = await conn.query(
            "insert into tblstaffcheckin values ($1,$2,$3,null)",
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

const checkOut = async (req, res) => {
    try {
        const data = req.body;
        // console.log(data.empid);
        // console.log(req.token);
        checkoutDate = new Date();
        // console.log(checkoutDate);

        const updateData = await conn.query(
            "update tblstaffcheckin set checkout=$1 where empid=$2 and token=$3",
            [checkoutDate, data.empid, req.token]
        );

        // res.send(updateData);

        if (updateData.rowCount <= 0) {
            res.status(400).send();
            return;
        }

        res.send({ present: false, empid: data.empid, checkoutDate });
    } catch (error) {
        res.status(400).send({ error });
    }
};

const checkInTableDetails = async (req, res) => {
    try {
        const data = await conn.query("select * from tblstaffcheckin");

        const checkInDetails = data.rows;
        res.send(checkInDetails);
    } catch (error) {
        res.status(400).send({ error });
    }
};

module.exports = { checkIn, checkOut, checkInTableDetails };
