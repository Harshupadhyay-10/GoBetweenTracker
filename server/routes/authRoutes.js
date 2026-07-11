const express = require("express");
const router = express.Router();
const { registerCustomer, login, setupAdmin } = require("../controllers/authController");

router.post("/register", registerCustomer);
router.post("/login", login);
router.post("/setup-admin", setupAdmin);

module.exports = router;