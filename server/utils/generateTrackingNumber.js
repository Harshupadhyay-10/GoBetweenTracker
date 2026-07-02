const { customAlphabet } = require("nanoid");

// Alphanumeric, uppercase, no confusing characters (no 0/O, 1/I)
const nanoid = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);

function generateTrackingNumber() {
  return `GBI${nanoid()}`; // e.g. GBI7F3K9QXZ
}

module.exports = generateTrackingNumber;