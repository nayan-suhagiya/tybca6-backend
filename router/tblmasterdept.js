const express = require("express");
const dept = require("../controller/dept");
const authAdmin = require("../middleware/authAdmin");
const router = new express.Router();

router.post("/admin/add-dept", authAdmin, dept.AddDept);
router.get("/admin/get-depts", authAdmin, dept.GetDept);
router.patch("/admin/update-dept", authAdmin, dept.UpdateDept);
router.delete("/admin/delete-dept/:id", authAdmin, dept.DeleteDept);

module.exports = router;
