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

    if (insertData.rowCount <= 0) {
      res.status(400).send();
      return;
    }

    res.send({
      present: true,
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

    if (updateData.rowCount <= 0) {
      res.status(400).send();
      return;
    }

    res.send({ present: false });
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

    if (insertLeave.rowCount <= 0) {
      res.status(400).send({ error: "unable to add" });
    } else {
      res.send({
        approved: true,
        empid: data.empid,
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

const addAbsentData = async (req, res) => {
  try {
    const data = req.body;
    const empid = data.empid;
    const dateArr = data.date;
    const month = data.month;
    const year = data.year;

    const findData = await conn.query(
      "select * from tblstaffabsent where empid=$1 and month=$2 and year=$3",
      [empid, month, year]
    );

    if (findData.rowCount <= 0) {
      const insertData = await conn.query(
        "insert into tblstaffabsent values($1,$2,$3,$4)",
        [empid, dateArr, month, year]
      );

      if (insertData.rowCount <= 0) {
        res.status(400).send();
        return;
      }

      res.send({
        added: true,
      });
    } else {
      const updateData = await conn.query(
        "update tblstaffabsent set date=$1 where empid=$2 and month=$3 and year=$4",
        [dateArr, empid, month, year]
      );

      res.send({
        updated: true,
      });
    }
  } catch (error) {
    res.status(400).send({ error });
  }
};

const getAbsentData = async (req, res) => {
  try {
    const data = await conn.query(
      "select * from tblstaffabsent where empid=$1",
      [req.params.empid]
    );

    const sendingData = data.rows;
    res.send(sendingData);
  } catch (error) {
    res.status(400).send({ error });
  }
};

const deleteLeave = async (req, res) => {
  try {
    let empid = req.params.empid;
    let fromdate = req.url.split("/")[3].split("?")[1];

    const deleteLeave = await conn.query(
      "delete from tblstaffleave where empid=$1 and fromdate=$2",
      [empid, fromdate]
    );

    if (deleteLeave.rowCount > 0) {
      res.send({ deleted: true });
    }
  } catch (error) {
    res.status(400).send({ error });
  }
};

const addWorkDetail = async (req, res) => {
  try {
    const data = req.body;
    const empid = data.empid;
    const date = data.date;
    const worktype = data.worktype;
    const hour = data.hour;
    const comment = data.comment;

    const addData = await conn.query(
      "insert into tblstaffworkdetails values($1,$2,$3,$4,$5)",
      [empid, date, worktype, hour, comment]
    );

    if (addData.rowCount <= 0) {
      res.status(400).send({ error: "unable to add" });
    } else {
      res.send({
        inserted: true,
      });
    }
  } catch (error) {
    res.status(400).send({ error });
  }
};

const getWorkDetails = async (req, res) => {
  try {
    const workData = await conn.query(
      "select * from tblstaffworkdetails where empid=$1",
      [req.params.empid]
    );

    const sendingData = workData.rows;

    res.send(sendingData);
  } catch (error) {
    res.status(400).send({ error });
  }
};

const getWorkDetailsUsingDate = async (req, res) => {
  try {
    const data = req.query;

    const workData = await conn.query(
      "select * from tblstaffworkdetails where empid=$1 and date=$2",
      [data.empid, data.date]
    );

    const sendingData = workData.rows;

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
  addAbsentData,
  getAbsentData,
  deleteLeave,
  addWorkDetail,
  getWorkDetails,
  getWorkDetailsUsingDate,
};
