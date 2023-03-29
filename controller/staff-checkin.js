const conn = require("../db/conn");
const moment = require("moment");

const checkIn = async (req, res) => {
    try {
        const data = req.body;
        checkinDate = new Date();
        date = moment(new Date()).format("YYYY-MM-DD");

        const insertData = await conn.query(
            "insert into tblstaffcheckin values ($1,$2,null,$3,$4)",
            [data.empid, checkinDate, date, req.token]
        );

        // res.send(insertData);

        if (insertData.rowCount <= 0) {
            res.status(400).send();
            return;
        }

        res.send({
            present: true,
            empid: data.empid,
            checkinDate,
            token: req.token,
        });
    } catch (error) {
        res.status(400).send({ error });
    }
};

const checkOut = async (req, res) => {
    try {
        const data = req.body;
        checkoutDate = new Date();

        const updateData = await conn.query(
            "update tblstaffcheckin set checkout=$1,token=$2 where empid=$3 and date=$4",
            [checkoutDate, req.token, data.empid, data.date]
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

        const leaveDays = await conn.query(
            "select * from tblleave where leavedate=$1 or leavedate=$2",
            [data.fromdate, data.todate]
        );

        if (leaveDays.rowCount !== 0) {
            return res.send({ offday: true });
        }

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

const getApprovedLeave = async (req, res) => {
    try {
        const data = await conn.query(
            "select * from tblstaffleave where empid=$1 and status='Approved'",
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
    getApprovedLeave,
};
