 const express = require("express");
const router = express.Router();
const {
  createShipment,
  getAllShipments,
  updateShipmentStatus,
  trackShipment,
} = require("../controllers/shipmentController");

router.post("/shipments", createShipment);
router.get("/shipments", getAllShipments);
router.patch("/shipments/:trackingNumber/status", updateShipmentStatus);
router.get("/track/:trackingNumber", trackShipment);

module.exports = router;