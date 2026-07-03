import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TrackShipment from "./pages/TrackShipment";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "16px", borderBottom: "1px solid #eee", fontFamily: "sans-serif" }}>
        <Link to="/" style={{ marginRight: "16px" }}>Track Shipment</Link>
        <Link to="/admin">Admin Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<TrackShipment />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;