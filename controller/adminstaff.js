const conn = require("../db/conn");
const moment = require("moment");

const AddStaff = async (req, res) => {
    try {
        // res.send(req.body);
        const staff = req.body;

        empid = staff.empid;
        fname = staff.fname;
        gender = staff.gender;
        dname = staff.dname;
        email = staff.email;
        mobile = staff.mobile;
        dob = staff.dob;
        jdate = staff.jdate;
        city = staff.city;
        state = staff.state;
        address = staff.address;
        password = staff.password;
        deptid = staff.deptid;

        if (
            !empid ||
            !fname ||
            !gender ||
            !dname ||
            !email ||
            !mobile ||
            !dob ||
            !jdate ||
            !city ||
            !state ||
            !address ||
            !password ||
            !deptid
        ) {
            res.status(400).send({ message: "please provide all details" });
            return;
        }

        const insert = await conn.query(
            "insert into tblstaff values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
            [
                empid,
                fname,
                gender,
                dname,
                email,
                mobile,
                dob,
                jdate,
                city,
                state,
                address,
                password,
                deptid,
            ]
        );

        if (insert.rowCount <= 0) {
            res.status(400).send({ message: "unable to insert" });
            return;
        }
        res.send({ empid: staff.empid, inserted: true });
    } catch (err) {
        res.status(400).send({ err });
    }
};

const GetStaff = async (req, res) => {
    try {
        const data = await conn.query("select * from tblstaff");

        if (data.rowCount <= 0) {
            res.status(404).send({ message: "not found" });
            return;
        }
        res.send(data.rows);
    } catch (error) {
        return res.status(404).send({ error });
    }
};

const getSpecificStaff = async (req, res) => {
    try {
        const empid = req.params.id;

        const result = await conn.query(
            "select * from tblstaff where empid=$1",
            [empid]
        );

        if (result.rowCount <= 0) {
            res.status(404).send({ message: "not found!" });
            return;
        }

        const sendingData = result.rows[0];

        res.send(sendingData);
    } catch (error) {}
};

const getStaffUsingDname = async (req, res) => {
    try {
        const dname = req.params.dname;

        // console.log(dname);

        const result = await conn.query(
            "select * from tblstaff where dname=$1",
            [dname]
        );

        // console.log(result);
        const sendingData = result.rows;

        if (result.rowCount <= 0) {
            // res.status(404).send({ message: "not found!" });
            res.send(sendingData);
            return;
        }

        res.send(sendingData);
    } catch (error) {}
};

const UpdateStaff = async (req, res) => {
    try {
        const staff = req.body;

        empid = staff.empid;
        fname = staff.fname;
        gender = staff.gender;
        dname = staff.dname;
        email = staff.email;
        mobile = staff.mobile;
        dob = staff.dob;
        jdate = staff.jdate;
        city = staff.city;
        state = staff.state;
        address = staff.address;
        password = staff.password;
        deptid = staff.deptid;

        const update = await conn.query(
            "update tblstaff set fname=$1,gender=$2,dname=$3,email=$4,mobile=$5,dob=$6,jdate=$7,city=$8,state=$9,address=$10,password=$11,deptid=$12 where empid=$13",
            [
                fname,
                gender,
                dname,
                email,
                mobile,
                dob,
                jdate,
                city,
                state,
                address,
                password,
                deptid,
                empid,
            ]
        );

        if (update.rowCount <= 0) {
            res.status(404).send({ message: "not found!" });
            return;
        }

        res.send({ empid: staff.empid, updated: true });
    } catch (error) {
        return res.status(404).send({ error });
    }
};

const DeleteStaff = async (req, res) => {
    try {
        const empid = req.params.id;

        const result = await conn.query("delete from tblstaff where empid=$1", [
            empid,
        ]);

        if (result.rowCount <= 0) {
            res.status(404).send({ message: "not found!" });
            return;
        }

        res.send({ empid, deleted: true });
    } catch (error) {
        return res.status(404).send({ error });
    }
};

const addLeave = async (req, res) => {
    try {
        const data = req.body;

        const addLeaveData = await conn.query(
            "insert into tblleave values($1)",
            [data.date]
        );

        if (addLeaveData.rowCount <= 0) {
            res.status(400).send({ error: "unable to insert" });
            return;
        }

        res.send({ added: true });
    } catch (error) {
        return res.status(400).send({ error });
    }
};

const removeLeave = async (req, res) => {
    try {
        const date = req.params.date;

        // console.log(date);

        const deleteLeave = await conn.query(
            "delete from tblleave where leavedate=$1",
            [date]
        );

        // console.log(deleteLeave);

        if (deleteLeave.rowCount <= 0) {
            res.send({ message: "not found!", deleted: false });
            return;
        }

        res.send({ deleted: true });
    } catch (error) {
        return res.status(400).send({ error });
    }
};

const getAllLeave = async (req, res) => {
    try {
        const leaveData = await conn.query("select * from tblleave");

        if (leaveData.rowCount <= 0) {
            res.status(404).send({ error: "not found!" });
            return;
        }

        const data = leaveData.rows;

        res.send(data);
    } catch (error) {
        res.status(400).send({ error });
    }
};

const getPendingStaffLeave = async (req, res) => {
    try {
        const pendingLeaveData = await conn.query(
            "select * from tblstaffleave where status='Pending'"
        );

        // console.log(pendingLeaveData);

        const sendingData = pendingLeaveData.rows;

        res.send(sendingData);
    } catch (error) {
        res.status(400).send({ error });
    }
};

const getApproveOrRejectStaffLeave = async (req, res) => {
    try {
        const approveOrRejectLeaveData = await conn.query(
            "select * from tblstaffleave where status='Approved' or status='Rejected'"
        );

        // console.log(approveOrRejectLeaveData);

        const sendingData = approveOrRejectLeaveData.rows;

        res.send(sendingData);
    } catch (error) {
        res.status(400).send({ error });
    }
};

const approveStaffLeave = async (req, res) => {
    try {
        const data = req.body;
        // console.log(data);

        fromdate = moment(data.fromdate).format("YYYY-MM-DD");

        const approveStaffLeave = await conn.query(
            "update tblstaffleave set status='Approved' where empid=$1 and fromdate=$2",
            [data.empid, fromdate]
        );

        if (approveStaffLeave.rowCount <= 0) {
            return res.status(400).send({ error: "unable to approve!" });
        }

        res.send({ approved: true, empid: data.empid });
    } catch (error) {
        res.status(400).send({ error });
    }
};

const rejectStaffLeave = async (req, res) => {
    try {
        const data = req.body;
        // console.log(data);

        fromdate = moment(data.fromdate).format("YYYY-MM-DD");

        const rejectStaffLeave = await conn.query(
            "update tblstaffleave set status='Rejected' where empid=$1 and fromdate=$2",
            [data.empid, fromdate]
        );

        if (rejectStaffLeave.rowCount <= 0) {
            return res.status(400).send({ error: "unable to reject!" });
        }

        res.send({ rejected: true, empid: data.empid });
    } catch (error) {
        res.status(400).send({ error });
    }
};

const addSalary = async (req, res) => {
    try {
        const data = req.body;
        // console.log(data);

        const insertData = await conn.query(
            "insert into tblsalary values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
            [
                data.empid,
                data.basicSalary,
                data.hra,
                data.medicalAllow,
                data.dearnessAllow,
                data.grossSal,
                data.epf,
                data.healthInsurance,
                data.tax,
                data.deduction,
                data.netPay,
                data.salarydate,
                data.fname,
            ]
        );

        // console.log(insertData);
        if (insertData.rowCount <= 0) {
            return res.status(400).send({ error: "unable to insert!" });
        }

        res.send({ empid: data.empid, inserted: true });
    } catch (error) {
        res.status(400).send({ error });
    }
};

const getSalary = async (req, res) => {
    try {
        const data = await conn.query("select * from tblsalary");

        // console.log(data.rows);

        const sendingData = data.rows;

        res.send(sendingData);
    } catch (error) {
        res.status(400).send({ error });
    }
};

const getSalaryForStaff = async (req, res) => {
    try {
        const data = await conn.query(
            "select * from tblsalary where empid=$1",
            [req.params.empid]
        );

        // console.log(data.rows);

        const sendingData = data.rows;

        res.send(sendingData);
    } catch (error) {
        res.status(400).send({ error });
    }
};

module.exports = {
    AddStaff,
    GetStaff,
    getSpecificStaff,
    getStaffUsingDname,
    UpdateStaff,
    DeleteStaff,
    addLeave,
    getAllLeave,
    removeLeave,
    getPendingStaffLeave,
    getApproveOrRejectStaffLeave,
    approveStaffLeave,
    rejectStaffLeave,
    addSalary,
    getSalary,
    getSalaryForStaff,
};
