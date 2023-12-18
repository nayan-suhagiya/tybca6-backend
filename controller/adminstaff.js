const conn = require("../db/conn");
const moment = require("moment");

const pdfmake = require("pdfmake");
const nodemailer = require("nodemailer");
const fs = require("fs");
const fonts = {
  Roboto: {
    normal: "fonts/Roboto-Regular.ttf",
    bold: "fonts/Roboto-Medium.ttf",
    italics: "fonts/Roboto-Italic.ttf",
    bolditalics: "fonts/Roboto-MediumItalic.ttf",
  },
};
const printer = new pdfmake(fonts);

// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nickpatel734@gmail.com",
    pass: "piiv mlts wfwt jtdp",
  },
});

const AddStaff = async (req, res) => {
  try {
    const staff = req.body;
    // console.log(staff);

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
    profile = staff.profile;
    bankname = staff.bankname;
    accountnumber = staff.accountnumber;
    ifsccode = staff.ifsccode;

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
      !bankname ||
      !accountnumber ||
      !ifsccode ||
      !deptid
    ) {
      res.status(400).send({ message: "please provide all details" });
      return;
    }

    const emailValid = await conn.query(
      "select * from tblstaff where email=$1",
      [email]
    );
    if (emailValid.rowCount > 0) {
      res.send({ empid: staff.empid, inserted: false, emailExist: true });
      return;
    }

    const mobileValid = await conn.query(
      "select * from tblstaff where mobile=$1",
      [mobile]
    );
    if (mobileValid.rowCount > 0) {
      res.send({
        empid: staff.empid,
        inserted: false,
        emailExist: false,
        mobileExist: true,
      });
      return;
    }

    const insert = await conn.query(
      "insert into tblstaff values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)",
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
        profile,
        bankname,
        accountnumber,
        ifsccode,
      ]
    );

    // console.log(insert);

    if (insert.rowCount <= 0) {
      res.status(400).send({ message: "unable to insert" });
      return;
    }

    const mailOptions = {
      from: "nickpatel734@gmail.com",
      to: `${email}`,
      subject: "Welcome to OFFICE MANAGEMENT SYSTEM-oms@admin.com",
      text: `Hello ${fname}`,
      html: `<h2 style="color:green">Thanks for joining with us!</h2> <br> <strong>Your USERNAME or ID = ${empid}</strong> <br> <strong>Your PASSWORD = ${password}</strong>`,
    };

    // const msg = {
    //   to: `${email}`,
    //   from: "suhagiya.nayan01@gmail.com",
    //   subject: "Welcome to OFFICE MANAGEMENT SYSTEM!-@admin",
    //   text: `Hello ${fname}`,
    //   html: `<h2 style="color:green">Thanks for joining with us!</h2> <br> <strong>Your USERNAME or ID = ${empid}</strong> <br> <strong>Your PASSWORD = ${password}</strong>`,
    // };

    // await sgMail
    //   .send(msg)
    //   .then(() => {
    //     console.log("add mail send!");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(error.message);
      }
      // console.log("Email sent: " + info.response);
      console.log("mail send!" + info.response);
      res.send({ empid: staff.empid, inserted: true });
    });
  } catch (err) {
    res.status(400).send({ err });
  }
};

const GetStaff = async (req, res) => {
  try {
    const data = await conn.query("select * from tblstaff");

    // if (data.rowCount <= 0) {
    //     res.status(404).send({ message: "not found" });
    //     return;
    // }

    console.log(data.rows);
    res.send(data.rows);
  } catch (error) {
    return res.status(404).send({ error });
  }
};

const getSpecificStaff = async (req, res) => {
  try {
    const empid = req.params.id;

    const result = await conn.query("select * from tblstaff where empid=$1", [
      empid,
    ]);

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

    const result = await conn.query("select * from tblstaff where dname=$1", [
      dname,
    ]);

    // console.log(result.rows);
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
    profile = staff.profile;
    bankname = staff.bankname;
    accountnumber = staff.accountnumber;
    ifsccode = staff.ifsccode;

    const data = await conn.query("select * from tblstaff where empid=$1", [
      empid,
    ]);
    const mainData = data.rows[0];

    if (email == mainData.email && mobile == mainData.mobile) {
      const update = await conn.query(
        "update tblstaff set fname=$1,gender=$2,dname=$3,email=$4,mobile=$5,dob=$6,jdate=$7,city=$8,state=$9,address=$10,password=$11,deptid=$12,profile=$13,bankname=$14,accountnumber=$15,ifsccode=$16 where empid=$17",
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
          profile,
          bankname,
          accountnumber,
          ifsccode,
          empid,
        ]
      );

      if (update.rowCount <= 0) {
        res.status(404).send({ message: "not found!" });
        return;
      }

      res.send({ empid: staff.empid, updated: true });
    } else {
      const update = await conn.query(
        "update tblstaff set fname=$1,gender=$2,dname=$3,email=$4,mobile=$5,dob=$6,jdate=$7,city=$8,state=$9,address=$10,password=$11,deptid=$12,profile=$13,bankname=$14,accountnumber=$15,ifsccode=$16 where empid=$17",
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
          profile,
          bankname,
          accountnumber,
          ifsccode,
          empid,
        ]
      );

      if (update.rowCount <= 0) {
        res.status(404).send({ message: "not found!" });
        return;
      }

      const mailOptions = {
        from: "nickpatel734@gmail.com",
        to: `${email}`,
        subject: "OFFICE MANAGEMENT SYSTEM-oms@admin.com",
        text: `Hello ${fname}`,
        html: `<h2 style="color:red">Your password is changed!</h2> <br> <strong>Your USERNAME or ID = ${empid}</strong> <br> <strong>Your PASSWORD = ${password}</strong>`,
      };

      // const msg = {
      //   to: `${email}`,
      //   from: "suhagiya.nayan01@gmail.com",
      //   subject: "OFFICE MANAGEMENT SYSTEM!-@admin",
      //   text: `Hello ${fname}`,
      //   html: `<h2 style="color:red">Your password is changed!</h2> <br> <strong>Your USERNAME or ID = ${empid}</strong> <br> <strong>Your PASSWORD = ${password}</strong>`,
      // };

      // await sgMail
      //   .send(msg)
      //   .then(() => {
      //     console.log("update mail send!");
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.error(error.message);
        }
        console.log("mail send!" + info.response);
        res.send({ empid: staff.empid, updated: true });
      });
    }
  } catch (error) {
    return res.status(404).send({ error });
  }
};

const DeleteStaff = async (req, res) => {
  try {
    const empid = req.params.id;
    console.log(empid);

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

    const addLeaveData = await conn.query("insert into tblleave values($1)", [
      data.date,
    ]);

    if (addLeaveData.rowCount <= 0) {
      res.status(400).send({ error: "unable to insert" });
      return;
    }

    res.send({ inserted: true });
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
    console.log(data);

    res.send(data);
  } catch (error) {
    res.status(400).send({ error });
  }
};

const getLeaveDayByDate = async (req, res) => {
  try {
    // console.log(req.query.date);
    const query = await conn.query(
      "select * from tblleave where leavedate=$1",
      [req.query.date]
    );

    // console.log(query);

    if (query.rowCount == 0) {
      res.status(200).send({ founded: false });
    } else {
      res.status(200).send({ founded: true });
    }
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
    console.log(sendingData);
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

    console.log(sendingData);
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

    res.send({ approved: false, empid: data.empid });
  } catch (error) {
    res.status(400).send({ error });
  }
};

const addSalary = async (req, res) => {
  try {
    const data = req.body;
    const userquery = await conn.query(
      "select * from tblstaff where empid=$1",
      [data.empid]
    );

    const userdata = userquery.rows[0];
    // console.log(data);

    const insertData = await conn.query(
      "insert into tblsalary values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)",
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
        data.month,
        data.year,
      ]
    );

    // console.log(insertData);
    if (insertData.rowCount <= 0) {
      return res.status(400).send({ error: "unable to insert!" });
    }

    let pdfDefinition = {
      content: [
        {
          image:
            "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAASQAAABrCAYAAADegP/hAAAAiXpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjaVY7dDcMwCITfmaIj8OfDjNNGidQNOn5xbCny9wB3CB3Q+fte9BoIO3mLjgS48PTUd4nOE2MWZRm96mR1k1JadnkynQLZg/1ZdOeNZui4wiPQcODQStfT7K5iTPfWCBuv5BOkvpTtc3z2A/QH9/wtElScpwkAAAoGaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA0LjQuMC1FeGl2MiI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMjkyIgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMTA3IgogICB0aWZmOkltYWdlV2lkdGg9IjI5MiIKICAgdGlmZjpJbWFnZUhlaWdodD0iMTA3IgogICB0aWZmOk9yaWVudGF0aW9uPSIxIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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",
          alignment: "center",
          width: 150,
        },

        {
          text: "Salary Slip",
          fontSize: 14,
          bold: true,
          decoration: "underline",
          color: "#4ca745",
          alignment: "center",
        },
        {
          text: "Staff Details",
          style: "sectionHeader",
        },
        {
          columns: [
            [
              {
                text: "Name : " + data.fname,
                bold: true,
              },
              {
                text: "Address : " + userdata.address,
                margin: [0, 5, 0, 0],
              },
              {
                text: "Contact : " + userdata.mobile,
                margin: [0, 5, 0, 0],
              },
            ],
            [
              {
                text: "Date : " + moment(data.salarydate).format("DD-MM-YYYY"),
                alignment: "right",
                margin: [0, 5, 0, 0],
              },
              {
                text: "Email : " + userdata.email,
                alignment: "right",
                margin: [0, 5, 0, 0],
              },
            ],
          ],
        },
        {
          text: "Salary Details",
          style: "sectionHeader",
        },
        { text: "Earnings(+)", style: "titleHeader", color: "#4ca745" },
        {
          table: {
            widths: ["*", "*", "*", "*"],
            body: [
              [
                "Basic Salary",
                "HRA(+22%)",
                "Medical Allowances(+8%)",
                "Dearness Allowances(+6.5%)",
              ],
              [
                data.basicSalary,
                data.hra,
                data.medicalAllow,
                data.dearnessAllow,
              ],
            ],
          },
        },
        {
          text: "Deductions(-)",
          style: "titleHeader",
          color: "#d9534f",
        },
        {
          table: {
            widths: ["*", "*", "*"],
            body: [
              ["EPF(-9%)", "Health Insurance(-3%)", "Tax(-5%)"],
              [data.epf, data.healthInsurance, data.tax],
            ],
          },
        },
        {
          columns: [
            [
              {
                text: "Net Payment: ",
                bold: true,
              },
            ],
            [
              {
                text: "₹" + data.netPay,
                alignment: "right",
                bold: true,
                color: "#4ca745",
              },
            ],
          ],
          margin: [0, 8, 0, 0], // [right,top,left,bottom]
        },
        {
          text: "Signature And Office Stamp!!",
          alignment: "right",
          // color: '#191eff',
          margin: [0, 25, 0, 0],
        },
        {
          image:
            "data:image/png;base64,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",
          alignment: "right",
          width: 70,
          margin: [35, 5, 0, 0],
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: "underline",
          fontSize: 14,
          margin: [0, 15, 0, 15], // [right,top,left,bottom]
        },
        titleHeader: {
          bold: true,
          fontSize: 10,
          margin: [0, 10, 0, 5], // [right,top,left,bottom]
        },
      },
    };

    let pdf = printer.createPdfKitDocument(pdfDefinition);
    // console.log(pdf);
    await pdf.pipe(
      fs.createWriteStream(
        "salary-slips/" +
          `Salary-${moment(data.salarydate).format("DD-MM-YYYY")}-${
            data.empid
          }.pdf`
      )
    );
    pdf.end();

    res.send({ empid: data.empid, inserted: true });
  } catch (error) {
    res.status(400).send({ error });
  }
};

const sendMail = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    //send mail of salary pay

    pathToAttachment =
      "salary-slips/" +
      `Salary-${moment(data.salarydate).format("DD-MM-YYYY")}-${
        data.empid
      }.pdf`;
    attachment = fs.readFileSync(pathToAttachment).toString("base64");

    const mailOptions = {
      from: "nickpatel734@gmail.com",
      to: `${data.email}`,
      subject: "Salary slip - From : oms@admin.com",
      html: "<strong>Your salary for this month is paid! Please download salary slip from the this email or your dashboard!</strong>",
      attachments: [
        {
          filename: "salary-slip.pdf",
          path: pathToAttachment, // Replace with the actual path to your PDF file
        },
      ],
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(error.message);
      }
      // console.log("Email sent: " + info.response);
      console.log("mail send!" + info.response);
      res.send({ mailSend: true });
    });

    // const msg = {
    //   to: `${data.email}`,
    //   from: "suhagiya.nayan01@gmail.com",
    //   subject: "From-Office Management System@admin!",
    //   text: `Hello ${data.fname}`,
    //   html: "<strong>Your salary for this month is paid! Please download salary slip from the this email or your dashboard!</strong>",
    //   attachments: [
    //     {
    //       content: attachment,
    //       filename: "salary-slip",
    //       type: "application/pdf",
    //       disposition: "attachment",
    //     },
    //   ],
    // };

    // await sgMail
    //   .send(msg)
    //   .then(() => {
    //     console.log("mail send!");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  } catch (error) {
    res.status(400).send({ error });
  }
};

const getSalary = async (req, res) => {
  try {
    const data = await conn.query("select * from tblsalary");

    // console.log(data.rows);

    const sendingData = data.rows;

    console.log(sendingData);
    res.send(sendingData);
  } catch (error) {
    res.status(400).send({ error });
  }
};

const deleteSalary = async (req, res) => {
  try {
    // console.log(req.url.split("?")[1]);
    // console.log(req.params.data);

    const empid = req.params.data;
    const salarydate = moment(req.url.split("?")[1]).format("YYYY-MM-DD");

    console.log(empid, salarydate);

    const deleteSalary = await conn.query(
      "delete from tblsalary where empid=$1 and salarydate=$2",
      [empid, salarydate]
    );

    if (deleteSalary.rowCount <= 0) {
      res.send({ message: "not found!", deleted: false });
      return;
    }

    res.send({ deleted: true });
  } catch (error) {
    res.status(400).send({ error });
  }
};

const getSalaryForStaff = async (req, res) => {
  try {
    const data = await conn.query("select * from tblsalary where empid=$1", [
      req.params.empid,
    ]);

    // console.log(data.rows);

    const sendingData = data.rows;

    res.send(sendingData);
  } catch (error) {
    res.status(400).send({ error });
  }
};

const getWorkDetails = async (req, res) => {
  try {
    const data = await conn.query(
      "select * from tblstaffworkdetails where date=$1",
      [req.params.date]
    );

    const sendingData = data.rows;

    console.log(sendingData);
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
  getLeaveDayByDate,
  getAllLeave,
  removeLeave,
  getPendingStaffLeave,
  getApproveOrRejectStaffLeave,
  approveStaffLeave,
  rejectStaffLeave,
  addSalary,
  getSalary,
  deleteSalary,
  getSalaryForStaff,
  sendMail,
  getWorkDetails,
};
