const express = require("express");
const router = new express.Router();
const authAdmin = require("../middleware/authAdmin");
const staff = require("../controller/staff");

router.post("/admin/add-staff", authAdmin, staff.AddStaff);
router.get("/admin/get-staff", authAdmin, staff.GetStaff);
router.get("/admin/get-staff/:id", authAdmin, staff.getSpecificStaff);
router.get(
    "/admin/get-staff-dname/:dname",
    authAdmin,
    staff.getStaffUsingDname
);
router.patch("/admin/update-staff", authAdmin, staff.UpdateStaff);
router.delete("/admin/delete-staff/:id", authAdmin, staff.DeleteStaff);

router.post("/admin/addleave", authAdmin, staff.addLeave);
router.delete("/admin/removeleave/:date", authAdmin, staff.removeLeave);
router.get("/admin/getall-leave", staff.getAllLeave);

router.get(
    "/admin/getpending-staffleave",
    authAdmin,
    staff.getPendingStaffLeave
);
router.get(
    "/admin/getapproveorreject-staffleave",
    authAdmin,
    staff.getApproveOrRejectStaffLeave
);
router.patch("/admin/approve-staffleave", authAdmin, staff.approveStaffLeave);
router.patch("/admin/reject-staffleave", authAdmin, staff.rejectStaffLeave);
module.exports = router;
