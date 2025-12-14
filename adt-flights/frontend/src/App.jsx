import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Flights from "./pages/Flights";
import FlightForm from "./pages/FlightForm";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <header className="topbar">
        <div className="topbarInner">
          <div className="brand">
            <div className="brandMark" />
            <div className="brandText">
              <strong>OpenAir</strong>
              <span>Flight intelligence dashboard</span>
            </div>
          </div>

          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Dashboard
            </NavLink>
            <NavLink to="/flights" className={({ isActive }) => (isActive ? "active" : "")}>
              Flights
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/flights/new" element={<FlightForm mode="create" />} />
          <Route path="/flights/edit/:id" element={<FlightForm mode="edit" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
