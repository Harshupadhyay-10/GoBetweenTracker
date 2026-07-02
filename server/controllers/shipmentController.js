const Shipment = require("../models/Shipment");
const generateTrackingNumber = require("../utils/generateTrackingNumber");

// @desc   Create a new shipment (admin)
// @route  POST /api/shipments
const createShipment = async (req, res) => {
  try {
    const { sender, receiver, packageDetails } = req.body;

    if (!sender || !receiver) {
      return res.status(400).json({ message: "Sender and receiver details are required" });
    }

    // Keep generating until we get a tracking number that isn't already used
    let trackingNumber;
    let exists = true;
    while (exists) {
      trackingNumber = generateTrackingNumber();
      exists = await Shipment.findOne({ trackingNumber });
    }

    const shipment = await Shipment.create({
      trackingNumber,
      sender,
      receiver,
      packageDetails,
      currentStatus: "Pending",
      statusHistory: [
        {
          status: "Pending",
          note: "Shipment created",
        },
      ],
    });

    res.status(201).json(shipment);
  } catch (err) {
    res.status(500).json({ message: "Failed to create shipment", error: err.message });
  }
};

// @desc   Get all shipments (admin)
// @route  GET /api/shipments
const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch shipments", error: err.message });
  }
};

// @desc   Update shipment status (admin)
// @route  PATCH /api/shipments/:trackingNumber/status
const updateShipmentStatus = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { status, location, note } = req.body;

    const validStatuses = ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const shipment = await Shipment.findOne({ trackingNumber });
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    shipment.currentStatus = status;
    shipment.statusHistory.push({ status, location, note });
    await shipment.save();

    res.json(shipment);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
};

// @desc   Public tracking lookup (customer) — only exposes safe fields
// @route  GET /api/track/:trackingNumber
const trackShipment = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const shipment = await Shipment.findOne({ trackingNumber }).select(
      "trackingNumber currentStatus statusHistory createdAt sender.city receiver.city"
    );

    if (!shipment) {
      return res.status(404).json({ message: "No shipment found with this tracking number" });
    }

    res.json(shipment);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tracking info", error: err.message });
  }
};

module.exports = {
  createShipment,
  getAllShipments,
  updateShipmentStatus,
  trackShipment,
};