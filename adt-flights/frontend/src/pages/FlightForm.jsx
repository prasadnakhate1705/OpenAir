import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate, useParams } from "react-router-dom";

function toInputValue(dt) {
  // Convert an ISO date to yyyy-MM-ddTHH:mm for <input type="datetime-local">
  const d = new Date(dt);
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return ${yyyy}-${mm}-${dd}T${hh}:${mi};
}

export default function FlightForm({ mode }) {
  const nav = useNavigate();
  const { id } = useParams();

  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    callsign: "",
    estdepartureairport: "",
    estarrivalairport: "",
    departure_time: "",
    arrival_time: "",
    icao24: "",
    typecode: "",
    model: "",
    registration: "",
    ingest_date: "",
    duration_min: "",
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const a = await api.get("/airports?limit=500");
        setAirports(a.data);

        if (mode === "edit") {
          const res = await api.get(/flights/${id});
          const f = res.data;
          setForm({
            callsign: f.callsign || "",
            estdepartureairport: f.estdepartureairport || "",
            estarrivalairport: f.estarrivalairport || "",
            departure_time: toInputValue(f.departure_time),
            arrival_time: toInputValue(f.arrival_time),
            icao24: f.icao24 || "",
            typecode: f.typecode || "",
            model: f.model || "",
            registration: f.registration || "",
            ingest_date: f.ingest_date || "",
            duration_min: f.duration_min ?? "",
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, id]);

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      departure_time: new Date(form.departure_time).toISOString(),
      arrival_time: new Date(form.arrival_time).toISOString(),
      duration_min: form.duration_min === "" ? null : Number(form.duration_min),
    };

    if (mode === "create") await api.post("/flights", payload);
    else await api.put(/flights/${id}, payload);

    nav("/flights");
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <div>
          <h2 className="pageTitle">{mode === "create" ? "Add Flight" : "Edit Flight"}</h2>
          <p className="pageSub">Create or update a flight record.</p>
        </div>

        <button type="button" className="btn" onClick={() => nav("/flights")}>
          Back to Flights
        </button>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.7)" }}>Loading form…</div>
        ) : (
          <form onSubmit={onSubmit} className="formGrid">
            <label>
              Callsign
              <input value={form.callsign} onChange={(e) => set("callsign", e.target.value)} placeholder="e.g. AAL123" />
            </label>

            <label>
              ICAO24
              <input value={form.icao24} onChange={(e) => set("icao24", e.target.value)} placeholder="e.g. a1b2c3" />
            </label>

            <label>
              Departure Airport (ICAO)
              <select value={form.estdepartureairport} onChange={(e) => set("estdepartureairport", e.target.value)}>
                <option value="">Select…</option>
                {airports.map((a) => (
                  <option key={a._id} value={a.icao}>
                    {a.icao} — {a.city || a.name || ""}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Arrival Airport (ICAO)
              <select value={form.estarrivalairport} onChange={(e) => set("estarrivalairport", e.target.value)}>
                <option value="">Select…</option>
                {airports.map((a) => (
                  <option key={a._id} value={a.icao}>
                    {a.icao} — {a.city || a.name || ""}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Departure Time
              <input type="datetime-local" value={form.departure_time} onChange={(e) => set("departure_time", e.target.value)} required />
            </label>

            <label>
              Arrival Time
              <input type="datetime-local" value={form.arrival_time} onChange={(e) => set("arrival_time", e.target.value)} required />
            </label>

            <label>
              Duration (min) (optional)
              <input value={form.duration_min} onChange={(e) => set("duration_min", e.target.value)} placeholder="e.g. 95" />
            </label>

            <label>
              Ingest Date
              <input type="date" value={form.ingest_date} onChange={(e) => set("ingest_date", e.target.value)} />
            </label>

            <label>
              Typecode
              <input value={form.typecode} onChange={(e) => set("typecode", e.target.value)} placeholder="e.g. A320" />
            </label>

            <label>
              Model
              <input value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="e.g. Airbus A320-214" />
            </label>

            <label className="span2">
              Registration
              <input value={form.registration} onChange={(e) => set("registration", e.target.value)} placeholder="e.g. N123AA" />
            </label>

            <div className="span2" style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
              <button type="button" className="btn" onClick={() => nav("/flights")}>
                Cancel
              </button>
              <button type="submit" className="btn btnPrimary">
                {mode === "create" ? "Create Flight" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
