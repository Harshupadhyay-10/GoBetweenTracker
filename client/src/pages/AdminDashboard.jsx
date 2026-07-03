import { useState, useEffect } from "react";
import api from "../api/axios";

function AdminDashboard() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    senderName: "", senderPhone: "", senderAddress: "", senderCity: "", senderState: "", senderPincode: "",
    receiverName: "", receiverPhone: "", receiverAddress: "", receiverCity: "", receiverState: "", receiverPincode: "",
    weight: "", description: "",
  });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/shipments");
      setShipments(res.data);
    } catch (err) {
      console.error("Failed to fetch shipments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMessage("");

    const payload = {
      sender: {
        name: formData.senderName,
        phone: formData.senderPhone,
        address: formData.senderAddress,
        city: formData.senderCity,
        state: formData.senderState,
        pincode: formData.senderPincode,
      },
      receiver: {
        name: formData.receiverName,
        phone: formData.receiverPhone,
        address: formData.receiverAddress,
        city: formData.receiverCity,
        state: formData.receiverState,
        pincode: formData.receiverPincode,
      },
      packageDetails: {
        weight: formData.weight ? Number(formData.weight) : undefined,
        description: formData.description,
      },
    };

    try {
      const res = await api.post("/shipments", payload);
      setMessage(`Shipment created. Tracking number: ${res.data.trackingNumber}`);
      setFormData({
        senderName: "", senderPhone: "", senderAddress: "", senderCity: "", senderState: "", senderPincode: "",
        receiverName: "", receiverPhone: "", receiverAddress: "", receiverCity: "", receiverState: "", receiverPincode: "",
        weight: "", description: "",
      });
      fetchShipments();
    } catch (err) {
      setMessage("Failed to create shipment. Check all required fields.");
    } finally {
      setCreating(false);
    }
  };

  const handleStatusUpdate = async (trackingNumber, status) => {
    const location = prompt("Enter current location (optional):") || "";
    const note = prompt("Add a note (optional):") || "";

    try {
      await api.patch(`/shipments/${trackingNumber}/status`, { status, location, note });
      fetchShipments();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard — Go Between India Logistics</h1>

      <section style={styles.section}>
        <h2>Create New Shipment</h2>
        <form onSubmit={handleCreate} style={styles.form}>
          <fieldset style={styles.fieldset}>
            <legend>Sender</legend>
            <input name="senderName" placeholder="Name" value={formData.senderName} onChange={handleChange} required />
            <input name="senderPhone" placeholder="Phone" value={formData.senderPhone} onChange={handleChange} required />
            <input name="senderAddress" placeholder="Address" value={formData.senderAddress} onChange={handleChange} required />
            <input name="senderCity" placeholder="City" value={formData.senderCity} onChange={handleChange} required />
            <input name="senderState" placeholder="State" value={formData.senderState} onChange={handleChange} required />
            <input name="senderPincode" placeholder="Pincode" value={formData.senderPincode} onChange={handleChange} required />
          </fieldset>

          <fieldset style={styles.fieldset}>
            <legend>Receiver</legend>
            <input name="receiverName" placeholder="Name" value={formData.receiverName} onChange={handleChange} required />
            <input name="receiverPhone" placeholder="Phone" value={formData.receiverPhone} onChange={handleChange} required />
            <input name="receiverAddress" placeholder="Address" value={formData.receiverAddress} onChange={handleChange} required />
            <input name="receiverCity" placeholder="City" value={formData.receiverCity} onChange={handleChange} required />
            <input name="receiverState" placeholder="State" value={formData.receiverState} onChange={handleChange} required />
            <input name="receiverPincode" placeholder="Pincode" value={formData.receiverPincode} onChange={handleChange} required />
          </fieldset>

          <fieldset style={styles.fieldset}>
            <legend>Package</legend>
            <input name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} />
            <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
          </fieldset>

          <button type="submit" disabled={creating} style={styles.button}>
            {creating ? "Creating..." : "Create Shipment"}
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </section>

      <section style={styles.section}>
        <h2>All Shipments</h2>
        {loading ? (
          <p>Loading...</p>
        ) : shipments.length === 0 ? (
          <p>No shipments yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Tracking #</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s._id}>
                  <td>{s.trackingNumber}</td>
                  <td>{s.sender.city}</td>
                  <td>{s.receiver.city}</td>
                  <td>{s.currentStatus}</td>
                  <td>
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) handleStatusUpdate(s.trackingNumber, e.target.value);
                        e.target.value = "";
                      }}
                    >
                      <option value="" disabled>Change status</option>
                      <option value="Pending">Pending</option>
                      <option value="Picked Up">Picked Up</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: { maxWidth: "900px", margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" },
  section: { marginBottom: "40px" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  fieldset: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "12px" },
  button: { padding: "10px 20px", fontSize: "16px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", width: "200px" },
  message: { marginTop: "10px", fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse" },
};

export default AdminDashboard;