// db/03_sample_crud_and_queries.js
// Run with: mongosh db/03_sample_crud_and_queries.js

// We'll store the demo doc's keys here so UPDATE/DELETE know what to target.
const DEMO = db.getCollection("demo_keys");

// ---------- CREATE (C) ----------
(function demoCreate() {
  const icao = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0"); // 6-char lowercase hex
  const dep = new Date("2022-09-05T10:00:00Z");
  const arr = new Date("2022-09-05T14:30:00Z");

  const doc = {
    icao24: icao,
    callsign: "TST100",
    estdepartureairport: "KJFK",
    estarrivalairport:   "KLAX",
    departure_time: dep,
    arrival_time:   arr,
    duration_min: Math.round((arr - dep) / 60000),
    ingest_date: "2022-09-05"
  };

  const ins = db.flights.insertOne(doc);
  print("[CREATE] insertedId:", ins.insertedId);

  // Persist keys for later steps (safe even if collection didn't exist)
  DEMO.updateOne(
    { _id: "latestDemo" },
    { $set: { icao24: icao, departure_time: dep } },
    { upsert: true }
  );
})();

// ---------- READ (R) ----------
(function demoRead() {
  print("\n[READ] Last 10 arrivals to KLAX (projected fields)");
  const cur = db.flights.find(
    { estarrivalairport: "KLAX" },
    { _id: 0, icao24: 1, callsign: 1, departure_time: 1, arrival_time: 1 }
  ).sort({ arrival_time: -1 }).limit(10);
  cur.forEach(printjson);
})();

// ---------- UPDATE (U) ----------
(function demoUpdate() {
  const key = DEMO.findOne({ _id: "latestDemo" });
  if (!key) { print("[UPDATE] No demo key found; skipping"); return; }

  const res = db.flights.updateOne(
    { icao24: key.icao24, departure_time: key.departure_time },
    { $set: { callsign: "TST200", tag: "demo" } }
  );
  print("[UPDATE] matched:", res.matchedCount, " modified:", res.modifiedCount);
})();

// ---------- DELETE (D) ----------
(function demoDelete() {
  const key = DEMO.findOne({ _id: "latestDemo" });
  if (!key) { print("[DELETE] No demo key found; skipping"); return; }

  const res = db.flights.deleteOne({ icao24: key.icao24, departure_time: key.departure_time });
  print("[DELETE] deleted:", res.deletedCount);
})();

// ---------- AGGREGATIONS ----------
(function demoAggs() {
  print("\n[AGG] Top 10 busiest routes by flight count");
  db.flights.aggregate([
    { $group: { _id: { dep: "$estdepartureairport", arr: "$estarrivalairport" }, flights: { $count: {} } } },
    { $sort: { flights: -1 } },
    { $limit: 10 }
  ]).forEach(printjson);

  print("\n[AGG] Average duration (min) by aircraft typecode");
  db.flights.aggregate([
    { $match: { duration_min: { $ne: null } } },
    { $group: { _id: "$typecode", avgDurationMin: { $avg: "$duration_min" }, n: { $count: {} } } },
    { $sort: { n: -1 } },
    { $limit: 10 }
  ]).forEach(printjson);
})();
