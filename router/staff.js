const express = require("express");
const router = new express.Router();
const authAdmin = require("../middleware/authAdmin");
const staff = require("../controller/staff");

router.post("/staff/check-in", authAdmin, staff.checkIn);
router.patch("/staff/check-out", authAdmin, staff.checkOut);
router.get("/staff/check-details", authAdmin, staff.checkInTableDetails);

router.post("/staff/apply-leave", authAdmin, staff.applyLeave);
router.get("/staff/get-applied-leave/:empid", authAdmin, staff.getLeaveData);
router.get(
    "/staff/get-approved-leave/:empid",
    authAdmin,
    staff.getApprovedLeave
);
router.post("/staff/add-absent", authAdmin, staff.addAbsentData);
router.get("/staff/get-absent/:empid", authAdmin, staff.getAbsentData);

module.exports = router;
