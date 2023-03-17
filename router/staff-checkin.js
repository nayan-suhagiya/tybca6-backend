const express = require("express");
const router = new express.Router();
const authAdmin = require("../middleware/authAdmin");
const staff_checkin = require("../controller/staff-checkin");

router.post("/staff/check-in", authAdmin, staff_checkin.checkIn);
router.patch("/staff/check-out", authAdmin, staff_checkin.checkOut);

module.exports = router;
