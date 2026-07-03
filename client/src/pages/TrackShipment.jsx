import { useState } from "react";
import api from "../api/axios";

function TrackShipment() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setShipment(null);

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/track/${trackingNumber.trim()}`);
      setShipment(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("No shipment found with this tracking number");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Track Your Shipment</h1>
      <p style={styles.subtitle}>Go Between India Logistics</p>

      <form onSubmit={handleTrack} style={styles.form}>
        <input
          type="text"
          placeholder="Enter tracking number (e.g. GBI7F3K9QXZ)"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Tracking..." : "Track"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {shipment && (
        <div style={styles.result}>
          <h2>Tracking Number: {shipment.trackingNumber}</h2>
          <p>
            <strong>From:</strong> {shipment.sender.city} &nbsp;→&nbsp;
            <strong>To:</strong> {shipment.receiver.city}
          </p>
          <p>
            <strong>Current Status:</strong>{" "}
            <span style={styles.status}>{shipment.currentStatus}</span>
          </p>

          <h3>Status History</h3>
          <ul style={styles.timeline}>
            {shipment.statusHistory
              .slice()
              .reverse()
              .map((entry, idx) => (
                <li key={idx} style={styles.timelineItem}>
                  <strong>{entry.status}</strong>
                  {entry.location && ` — ${entry.location}`}
                  <br />
                  <small>{new Date(entry.updatedAt).toLocaleString()}</small>
                  {entry.note && <p style={styles.note}>{entry.note}</p>}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" },
  title: { marginBottom: "4px" },
  subtitle: { color: "#666", marginBottom: "24px" },
  form: { display: "flex", gap: "8px", marginBottom: "20px" },
  input: { flex: 1, padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "4px" },
  button: { padding: "10px 20px", fontSize: "16px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  error: { color: "red" },
  result: { border: "1px solid #eee", borderRadius: "8px", padding: "20px", marginTop: "20px" },
  status: { fontWeight: "bold", color: "#0a7d2c" },
  timeline: { listStyle: "none", padding: 0 },
  timelineItem: { borderLeft: "3px solid #1a1a1a", paddingLeft: "12px", marginBottom: "16px" },
  note: { color: "#555", margin: "4px 0 0" },
};

export default TrackShipment;