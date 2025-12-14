import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [top, setTop] = useState([]);

  useEffect(() => {
    (async () => {
      const o = await api.get("/stats/overview");
      setOverview(o.data);

      const t = await api.get("/stats/top-airports?limit=8");
      setTop(t.data);
    })();
  }, []);

  const maxDepartures = useMemo(() => {
    return top.reduce((m, r) => Math.max(m, r.departures || 0), 0);
  }, [top]);

  if (!overview) return <div className="card">Loading…</div>;

  return (
    <div>
      <h2 className="pageTitle">Dashboard</h2>
      <p className="pageSub">High-level metrics and airport activity.</p>

      <div className="kpiRow">
        <div className="card">
          <div className="kpiTitle">Total Flights</div>
          <div className="kpiValue">{overview.total_flights}</div>
        </div>
        <div className="card">
          <div className="kpiTitle">Total Airports</div>
          <div className="kpiValue">{overview.total_airports}</div>
        </div>
        <div className="card">
          <div className="kpiTitle">Total Aircraft</div>
          <div className="kpiValue">{overview.total_aircrafts}</div>
        </div>
      </div>

      <div className="gridDash">
        {/* LEFT: chart */}
        <div className="card">
          <div className="cardTitleRow">
            <h3 style={{ margin: 0 }}>Top Departure Airports</h3>
            <span className="badge">Top {Math.min(top.length, 8)}</span>
          </div>

          <div style={{ width: "100%", height: 360, marginTop: 12 }}>
            <ResponsiveContainer>
              <BarChart data={top}>
                <CartesianGrid stroke="rgba(255,255,255,0.10)" vertical={false} />
                <XAxis dataKey="icao" tick={{ fill: "rgba(255,255,255,0.70)" }} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.70)" }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,14,25,0.92)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    color: "rgba(255,255,255,0.9)",
                  }}
                />
                <Bar dataKey="departures" fill="#7dd3fc" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT: insights */}
        <div className="card">
          <div className="cardTitleRow">
            <h3 style={{ margin: 0 }}>Insights</h3>
            <span className="badge">Live</span>
          </div>

          <div className="miniList">
            <div className="miniRow">
              <span style={{ color: "rgba(255,255,255,0.70)", fontSize: 13 }}>Busiest airport</span>
              <strong>{top[0]?.icao || "-"}</strong>
            </div>

            <div className="miniRow">
              <span style={{ color: "rgba(255,255,255,0.70)", fontSize: 13 }}>Peak departures</span>
              <strong>{maxDepartures || "-"}</strong>
            </div>

            <div className="miniRow">
              <span style={{ color: "rgba(255,255,255,0.70)", fontSize: 13 }}>Coverage</span>
              <strong>{overview.total_airports} airports</strong>
            </div>

            <div style={{ marginTop: 10, color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
              Top airports list
            </div>

            {top.slice(0, 6).map((r) => (
              <div key={r.icao} className="miniRow">
                <span className="badge">{r.icao}</span>
                <strong>{r.departures}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
