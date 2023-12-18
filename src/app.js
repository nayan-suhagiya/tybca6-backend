const express = require("express");
const cors = require("cors");
const app = express();
let PORT = process.env.PORT || 3000;
const loginRouter = require("../router/login");
const tblmasterdeptRouter = require("../router/tblmasterdept");
const adminStaffRouter = require("../router/adminstaff");
const staffRouter = require("../router/staff");
app.use(express.json());

const corsOption = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOption));

app.use(loginRouter);
app.use(tblmasterdeptRouter);
app.use(adminStaffRouter);
app.use(staffRouter);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
