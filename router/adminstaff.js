const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const adminStaff = require("../controller/adminstaff");

router.post("/admin/add-staff", auth, adminStaff.AddStaff);
router.get("/admin/get-staff", auth, adminStaff.GetStaff);
router.get("/admin/get-staff/:id", auth, adminStaff.getSpecificStaff);
router.get(
  "/admin/get-staff-dname/:dname",
  auth,
  adminStaff.getStaffUsingDname
);
router.patch("/admin/update-staff", auth, adminStaff.UpdateStaff);
router.delete("/admin/delete-staff/:id", auth, adminStaff.DeleteStaff);

router.post("/admin/addleave", auth, adminStaff.addLeave);
router.delete("/admin/removeleave/:date", auth, adminStaff.removeLeave);
router.get("/admin/getall-leave", adminStaff.getAllLeave);
router.get("/staff/get-leave-by-date", auth, adminStaff.getLeaveDayByDate);

router.get(
  "/admin/getpending-staffleave",
  auth,
  adminStaff.getPendingStaffLeave
);
router.get(
  "/admin/getapproveorreject-staffleave",
  auth,
  adminStaff.getApproveOrRejectStaffLeave
);
router.patch("/admin/approve-staffleave", auth, adminStaff.approveStaffLeave);
router.patch("/admin/reject-staffleave", auth, adminStaff.rejectStaffLeave);
router.post("/admin/add-salary", auth, adminStaff.addSalary);
router.get("/admin/get-salary", auth, adminStaff.getSalary);
router.delete("/admin/delete-salary/:data", auth, adminStaff.deleteSalary);
router.get("/staff/get-salary/:empid", auth, adminStaff.getSalaryForStaff);
router.post("/admin/send-mail", auth, adminStaff.sendMail);
router.get("/admin/get-staff-work/:date", auth, adminStaff.getWorkDetails);

module.exports = router;
