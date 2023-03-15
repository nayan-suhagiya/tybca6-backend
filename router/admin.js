const express = require("express");
const router = new express.Router();
const authAdmin = require("../middleware/authAdmin");
const admin = require("../controller/admin");

router.post("/login", admin.LoginAdmin);
router.get("/logout", authAdmin, admin.LogoutAdmin);

module.exports = router;
