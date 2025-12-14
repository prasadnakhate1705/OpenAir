from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from database import airports_col, flights_col
from models import FlightIn, FlightOut
from utils import oid_str

app = FastAPI(title="OpenAir API")

# React dev server CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    return {"ok": True}

# -------- Airports (read-only) --------
@app.get("/api/airports")
async def list_airports(limit: int = 200):
    cursor = airports_col.find({}, {"icao": 1, "name": 1, "city": 1, "country": 1, "dep_count": 1, "arr_count": 1}).limit(limit)
    docs = [oid_str(d) async for d in cursor]
    # sort client-side is fine, but let's keep it stable
    docs.sort(key=lambda x: (x.get("icao") or ""))
    return docs

# -------- Flights CRUD --------
@app.get("/api/flights", response_model=List[FlightOut])
async def list_flights(
    airport: Optional[str] = None,   # filter by either origin or destination
    date: Optional[str] = None,      # filter by ingest_date 'YYYY-MM-DD'
    limit: int = 200
):
    q = {}
    if airport:
        q["$or"] = [{"estdepartureairport": airport}, {"estarrivalairport": airport}]
    if date:
        q["ingest_date"] = date

    cursor = flights_col.find(q).sort("departure_time", -1).limit(limit)
    docs = [oid_str(d) async for d in cursor]
    return docs

@app.get("/api/flights/{flight_id}", response_model=FlightOut)
async def get_flight(flight_id: str):
    if not ObjectId.is_valid(flight_id):
        raise HTTPException(status_code=400, detail="Invalid id")
    doc = await flights_col.find_one({"_id": ObjectId(flight_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Flight not found")
    return oid_str(doc)

@app.post("/api/flights", response_model=FlightOut)
async def create_flight(payload: FlightIn):
    doc = payload.model_dump()
    # compute duration if missing
    if doc.get("duration_min") is None and doc.get("departure_time") and doc.get("arrival_time"):
        delta = doc["arrival_time"] - doc["departure_time"]
        doc["duration_min"] = int(delta.total_seconds() // 60)

    res = await flights_col.insert_one(doc)
    created = await flights_col.find_one({"_id": res.inserted_id})
    return oid_str(created)

@app.put("/api/flights/{flight_id}", response_model=FlightOut)
async def update_flight(flight_id: str, payload: FlightIn):
    if not ObjectId.is_valid(flight_id):
        raise HTTPException(status_code=400, detail="Invalid id")

    doc = payload.model_dump()
    if doc.get("duration_min") is None and doc.get("departure_time") and doc.get("arrival_time"):
        delta = doc["arrival_time"] - doc["departure_time"]
        doc["duration_min"] = int(delta.total_seconds() // 60)

    res = await flights_col.update_one({"_id": ObjectId(flight_id)}, {"$set": doc})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Flight not found")
    updated = await flights_col.find_one({"_id": ObjectId(flight_id)})
    return oid_str(updated)

@app.delete("/api/flights/{flight_id}")
async def delete_flight(flight_id: str):
    # Try ObjectId delete first (common case)
    if ObjectId.is_valid(flight_id):
        res = await flights_col.delete_one({"_id": ObjectId(flight_id)})
        if res.deleted_count == 1:
            return {"deleted": True}

    # Fallback: delete if _id is stored as a plain string
    res = await flights_col.delete_one({"_id": flight_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Flight not found")

    return {"deleted": True}

# -------- Aircrafts (derived from flights since aircrafts collection is empty) --------
@app.get("/api/aircrafts")
async def list_aircrafts(limit: int = 200):
    pipeline = [
        {
            "$group": {
                "_id": {
                    "icao24": "$icao24",
                    "typecode": "$typecode",
                    "model": "$model",
                    "registration": "$registration"
                },
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"count": -1}},
        {"$limit": limit}
    ]
    rows = []
    async for r in flights_col.aggregate(pipeline):
        item = r["_id"]
        item["count"] = r["count"]
        rows.append(item)
    return rows

# -------- Stats for Dashboard --------
@app.get("/api/stats/overview")
async def overview():
    flights = await flights_col.count_documents({})
    airports = await airports_col.count_documents({})
    # aircrafts from flights distinct
    aircraft_distinct = await flights_col.distinct("icao24")
    return {
        "total_flights": flights,
        "total_airports": airports,
        "total_aircrafts": len([x for x in aircraft_distinct if x])
    }

@app.get("/api/stats/top-airports")
async def top_airports(limit: int = 5):
    # busy by departures (simple + fast)
    pipeline = [
        {"$group": {"_id": "$estdepartureairport", "departures": {"$sum": 1}}},
        {"$sort": {"departures": -1}},
        {"$limit": limit}
    ]
    out = []
    async for r in flights_col.aggregate(pipeline):
        out.append({"icao": r["_id"], "departures": r["departures"]})
    return out
