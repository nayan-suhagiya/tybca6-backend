const express = require("express");
const router = new express.Router();
const authAdmin = require("../middleware/authAdmin");
const staff = require("../controller/staff");

router.post("/admin/add-staff", authAdmin, staff.AddStaff);
router.get("/admin/get-staff", authAdmin, staff.GetStaff);
router.patch("/admin/update-staff", authAdmin, staff.UpdateStaff);
router.delete("/admin/delete-staff/:id", authAdmin, staff.DeleteStaff);

module.exports = router;
