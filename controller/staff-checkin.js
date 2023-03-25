const conn = require("../db/conn");
const moment = require("moment");

const checkIn = async (req, res) => {
    try {
        const data = req.body;
        checkinDate = new Date();

        const insertData = await conn.query(
            "insert into tblstaffcheckin values ($1,$2,null,$3)",
            [data.empid, checkinDate, req.token]
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
            "update tblstaffcheckin set checkout=$1,token=$2 where empid=$3",
            [checkoutDate, req.token, data.empid]
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

const applyLeave = async (req, res) => {
    try {
        const data = req.body;

        const insertLeave = await conn.query(
            "insert into tblstaffleave values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
            [
                data.empid,
                data.deptid,
                data.fname,
                data.dname,
                data.reason,
                data.fromdate,
                data.todate,
                data.description,
                data.appliedOn,
                data.status,
            ]
        );

        // console.log(insertLeave);

        if (insertLeave.rowCount <= 0) {
            res.status(400).send({ error: "unable to add" });
        } else {
            res.send({
                added: true,
                empid: data.empid,
                appliedOn: data.appliedOn,
            });
        }
    } catch (error) {
        res.status(400).send({ error });
    }
};

const getLeaveData = async (req, res) => {
    try {
        const data = await conn.query(
            "select * from tblstaffleave where empid=$1",
            [req.params.empid]
        );

        const sendingData = data.rows;

        res.send(sendingData);
    } catch (error) {
        res.status(400).send({ error });
    }
};

module.exports = {
    checkIn,
    checkOut,
    checkInTableDetails,
    applyLeave,
    getLeaveData,
};
