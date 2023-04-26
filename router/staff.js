const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const staff = require("../controller/staff");

router.post("/staff/check-in", auth, staff.checkIn);
router.patch("/staff/check-out", auth, staff.checkOut);
router.get("/staff/check-details", auth, staff.checkInTableDetails);

router.post("/staff/apply-leave", auth, staff.applyLeave);
router.get("/staff/get-applied-leave/:empid", auth, staff.getLeaveData);
router.get("/staff/get-approved-leave/:empid", auth, staff.getApprovedLeave);
router.post("/staff/add-absent", auth, staff.addAbsentData);
router.get("/staff/get-absent/:empid", auth, staff.getAbsentData);
router.post("/staff/add-work-detail", auth, staff.addWorkDetail);
router.get("/staff/get-work-detail/:empid", auth, staff.getWorkDetails);
router.get("/staff/get-work-detail", auth, staff.getWorkDetailsUsingDate);

module.exports = router;
