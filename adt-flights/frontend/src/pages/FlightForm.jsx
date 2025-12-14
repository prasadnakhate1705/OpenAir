import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate, useParams } from "react-router-dom";

function toInputValue(dt) {
  // dt could be ISO string; convert to yyyy-MM-ddTHH:mm for <input type=datetime-local>
  const d = new Date(dt);
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return '${yyyy}-${mm}-${dd}T${hh}:${mi}';
}

export default function FlightForm({ mode }) {
  const nav = useNavigate();
  const { id } = useParams();

  const [airports, setAirports] = useState([]);

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
    duration_min: ""
  });

  useEffect(() => {
    (async () => {
      const a = await api.get("/airports?limit=500");
      setAirports(a.data);

      if (mode === "edit") {
        const res = await api.get('/flights/${id}');
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
          duration_min: f.duration_min ?? ""
        });
      }
    })();
  }, [mode, id]);

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    // FastAPI expects ISO datetime strings; datetime-local gives local time without timezone.
    // This is OK for demo; backend will parse it.
    const payload = {
      ...form,
      departure_time: new Date(form.departure_time).toISOString(),
      arrival_time: new Date(form.arrival_time).toISOString(),
      duration_min: form.duration_min === "" ? null : Number(form.duration_min)
    };

    if (mode === "create") await api.post("/flights", payload);
    else await api.put('/flights/${id}', payload);

    nav("/flights");
  }

  return (
    <div>
      <h2>{mode === "create" ? "Add Flight" : "Edit Flight"}</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <label>
          Callsign
          <input value={form.callsign} onChange={(e) => set("callsign", e.target.value)} />
        </label>

        <label>
          Departure Airport (ICAO)
          <select value={form.estdepartureairport} onChange={(e) => set("estdepartureairport", e.target.value)}>
            <option value="">Select…</option>
            {airports.map((a) => (
              <option key={a._id} value={a.icao}>{a.icao}</option>
            ))}
          </select>
        </label>

        <label>
          Arrival Airport (ICAO)
          <select value={form.estarrivalairport} onChange={(e) => set("estarrivalairport", e.target.value)}>
            <option value="">Select…</option>
            {airports.map((a) => (
              <option key={a._id} value={a.icao}>{a.icao}</option>
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
          <input value={form.duration_min} onChange={(e) => set("duration_min", e.target.value)} />
        </label>

        <label>
          ICAO24
          <input value={form.icao24} onChange={(e) => set("icao24", e.target.value)} />
        </label>

        <label>
          Typecode
          <input value={form.typecode} onChange={(e) => set("typecode", e.target.value)} />
        </label>

        <label>
          Model
          <input value={form.model} onChange={(e) => set("model", e.target.value)} />
        </label>

        <label>
          Registration
          <input value={form.registration} onChange={(e) => set("registration", e.target.value)} />
        </label>

        <label>
          Ingest Date (YYYY-MM-DD)
          <input value={form.ingest_date} onChange={(e) => set("ingest_date", e.target.value)} placeholder="2022-09-01" />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">{mode === "create" ? "Create" : "Save"}</button>
          <button type="button" onClick={() => nav("/flights")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
