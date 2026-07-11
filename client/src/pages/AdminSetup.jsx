import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AdminSetup() {
  const [formData, setFormData] = useState({
    setupSecret: "", name: "", email: "", password: "", phone: "", address: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/setup-admin", formData);
      setMessage("Admin account created successfully. You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-narrow">
      <div className="card">
        <h1>First-Time Admin Setup</h1>
        <p className="text-muted">
          This page only works once. After your admin account is created, this form will stop working permanently.
        </p>
        <form onSubmit={handleSubmit} className="form">
          <input
            name="setupSecret"
            type="password"
            placeholder="Setup Secret Key"
            value={formData.setupSecret}
            onChange={handleChange}
            required
          />
          <input name="name" placeholder="Your Full Name" value={formData.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Choose a Password" value={formData.password} onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          <input name="address" placeholder="Business Address" value={formData.address} onChange={handleChange} required />
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Creating account..." : "Create Admin Account"}
          </button>
        </form>
        {message && <p style={{ color: "#2E9E5B", fontWeight: 600 }}>{message}</p>}
        {error && <p className="text-error">{error}</p>}
      </div>
    </div>
  );
}

export default AdminSetup;