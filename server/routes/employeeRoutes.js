const express = require("express");
const router = express.Router();
const { createEmployee, getAllEmployees, deleteEmployee } = require("../controllers/employeeController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/employees", protect, adminOnly, createEmployee);
router.get("/employees", protect, adminOnly, getAllEmployees);
router.delete("/employees/:id", protect, adminOnly, deleteEmployee);

module.exports = router;