import { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

export default function Flights() {
  const [rows, setRows] = useState([]);
  const [airport, setAirport] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const params = { limit: 200 };
      if (airport) params.airport = airport;
      if (date) params.date = date;

      const res = await api.get("/flights", { params });
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onDelete(id) {
    if (!window.confirm("Delete this flight?")) return;
    await api.delete(`/flights/${id}`);
    await load();
  }

  function onReset() {
    setAirport("");
    setDate("");
    setTimeout(load, 0);
  }

  return (
    <div>
      {/* HEADER + ADD BUTTON */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Flights</h2>

        {/* IMPORTANT: this is the Add button */}
        <Link to="/flights/new" className="btn btnPrimary btnAsLink">
          + Add Flight
        </Link>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <input
          placeholder="Filter by airport ICAO (e.g., LIRF)"
          value={airport}
          onChange={(e) => setAirport(e.target.value.toUpperCase())}
        />
        <input
          placeholder="Filter by ingest_date (YYYY-MM-DD)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button className="btn" onClick={load}>
          Apply
        </button>
        <button className="btn" onClick={onReset}>
          Reset
        </button>
      </div>

      <div style={{ marginBottom: 10, color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
        {loading ? "Loading flights…" : `Showing ${rows.length} flights`}
      </div>

      {/* TABLE */}
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Callsign</th>
              <th>From</th>
              <th>To</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Duration</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r._id}>
                <td>{r.callsign || "-"}</td>
                <td>{r.estdepartureairport}</td>
                <td>{r.estarrivalairport}</td>
                <td>{new Date(r.departure_time).toLocaleString()}</td>
                <td>{new Date(r.arrival_time).toLocaleString()}</td>
                <td>{r.duration_min ?? "-"}</td>
                <td>{r.typecode || r.model || "-"}</td>
                <td>
                  <div className="actions">
                    <Link className="btnAsLink" to={`/flights/edit/${r._id}`}>
                      Edit
                    </Link>
                    <button className="btn btnDanger" onClick={() => onDelete(r._id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan="8" style={{ color: "rgba(255,255,255,0.7)" }}>
                  No flights found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
