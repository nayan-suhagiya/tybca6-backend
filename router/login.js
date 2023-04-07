const express = require("express");
const router = new express.Router();
const authAdmin = require("../middleware/authAdmin");
const login = require("../controller/login");

router.post("/login", login.LoginAdmin);
router.get("/logout", authAdmin, login.LogoutAdmin);

module.exports = router;
