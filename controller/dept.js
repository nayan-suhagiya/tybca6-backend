const conn = require("../db/conn");

const AddDept = async (req, res) => {
    try {
        const deptid = req.body.deptid;
        const dname = req.body.dname;
        const insert = await conn.query(
            "insert into tblmasterdept values($1,$2)",
            [deptid, dname]
        );

        if (insert.rowCount <= 0) {
            res.status(400).send({ message: "unable to insert" });
            return;
        }
        res.status(201).send({ deptid, inserted: true });
    } catch (error) {
        res.status(400).send({ err: error.message });
    }
};

const GetDept = async (req, res) => {
    try {
        const data = await conn.query(
            "select * from tblmasterdept order by deptid"
        );

        if (data.rowCount <= 0) {
            res.status(404).send({ message: "data not found!" });
            return;
        }

        res.send(data.rows);
    } catch (error) {
        return res.status(400).send({ error });
    }
};

const UpdateDept = async (req, res) => {
    try {
        // res.send(req.body);
        const deptid = req.body.deptid;
        const dname = req.body.dname;

        if (deptid == "") {
            res.status(404).send({ err: "please provide deptID" });
        }

        const update = await conn.query(
            `update tblmasterdept set dname=$1 where deptid=$2`,
            [dname, deptid]
        );

        if (update.rowCount <= 0) {
            res.status(404).send({ message: "not found!" });
            return;
        }
        res.send({ deptid, updated: true });
    } catch (error) {
        res.status(400).send({ error });
    }
};

const DeleteDept = async (req, res) => {
    try {
        // res.send(req.body);
        const deptid = req.params.id;

        if (!deptid) {
            res.status(400).send({ err: "please provide deptid!" });
        }

        const deleteData = await conn.query(
            "delete from tblmasterdept where deptid=$1",
            [deptid]
        );

        if (deleteData.rowCount <= 0) {
            res.status(404).send({ message: "not found!" });
            return;
        }
        res.send({ deptid, deleted: true });
    } catch (error) {
        res.status(400).send({ err: error.message });
    }
};

module.exports = { AddDept, GetDept, DeleteDept, UpdateDept };
