const express = require("express");
const router = new express.Router();
const authAdmin = require("../middleware/authAdmin");
const staff_checkin = require("../controller/staff-checkin");

router.post("/staff/check-in", authAdmin, staff_checkin.checkIn);
router.patch("/staff/check-out", authAdmin, staff_checkin.checkOut);
router.get(
    "/staff/check-details",
    authAdmin,
    staff_checkin.checkInTableDetails
);

router.post("/staff/apply-leave", authAdmin, staff_checkin.applyLeave);
router.get(
    "/staff/get-applied-leave/:empid",
    authAdmin,
    staff_checkin.getLeaveData
);
router.get(
    "/staff/get-approved-leave/:empid",
    authAdmin,
    staff_checkin.getApprovedLeave
);

module.exports = router;
