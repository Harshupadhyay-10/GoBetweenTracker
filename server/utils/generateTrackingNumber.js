const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);

const modePrefix = {
  Air: "A",
  Road: "R",
  Sea: "S",
};

function generateTrackingNumber(mode) {
  const prefix = modePrefix[mode] || "R";
  return `GBI${prefix}${nanoid()}`; // e.g. GBIA7F3K9QXZ for an air shipment
}

module.exports = generateTrackingNumber;