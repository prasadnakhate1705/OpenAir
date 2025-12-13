import { useEffect, useState } from "react";
import { api } from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";


export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [top, setTop] = useState([]);

  useEffect(() => {
    (async () => {
      const o = await api.get("/stats/overview");
      setOverview(o.data);
      const t = await api.get("/stats/top-airports?limit=5");
      setTop(t.data);
    })();
  }, []);

  if (!overview) return <div>Loading…</div>;

  return (
    <div>
      <h2>OpenAir Dashboard</h2>

      {/* KPI CARDS */}
      <div className="kpiRow">
        <div className="card" style={{ minWidth: 220 }}>
          <div className="kpiTitle">Total Flights</div>
          <div className="kpiValue">{overview.total_flights}</div>
        </div>

        <div className="card" style={{ minWidth: 220 }}>
          <div className="kpiTitle">Total Airports</div>
          <div className="kpiValue">{overview.total_airports}</div>
        </div>

        <div className="card" style={{ minWidth: 220 }}>
          <div className="kpiTitle">Total Aircrafts</div>
          <div className="kpiValue">{overview.total_aircrafts}</div>
        </div>
      </div>

      <h3>Top Departure Airports</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={top}>
            import { CartesianGrid } from "recharts";<CartesianGrid stroke="rgba(255,255,255,0.12)" />
            <XAxis dataKey="icao" tick={{ fill: "rgba(255,255,255,0.7)" }} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.7)" }} />
            <Tooltip />
            <Bar dataKey="departures" fill="#7dd3fc" radius={[8, 8, 0, 0]} />
            <XAxis dataKey="icao" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="departures" fill="#7dd3fc" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
