const express = require("express");
const dept = require("../controller/dept");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/admin/add-dept", auth, dept.AddDept);
router.get("/admin/get-depts", auth, dept.GetDept);
router.patch("/admin/update-dept", auth, dept.UpdateDept);
router.delete("/admin/delete-dept/:id", auth, dept.DeleteDept);

module.exports = router;
