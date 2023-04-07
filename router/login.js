const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const login = require("../controller/login");

router.post("/login", login.LoginAdmin);
router.get("/logout", auth, login.LogoutAdmin);

module.exports = router;
