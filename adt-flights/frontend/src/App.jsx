import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Flights from "./pages/Flights";
import FlightForm from "./pages/FlightForm";

export default function App() {
  return (
    <BrowserRouter>
     <div className="container">
        <nav className="nav">
        <Link to="/">Dashboard</Link>
        <Link to="/flights">Flights (CRUD)</Link>
        </nav>


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
