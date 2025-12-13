from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FlightIn(BaseModel):
    departure_time: datetime
    arrival_time: datetime

    estdepartureairport: str = Field(..., min_length=3)  # ICAO like LIRF
    estarrivalairport: str = Field(..., min_length=3)

    callsign: Optional[str] = None
    icao24: Optional[str] = None

    duration_min: Optional[int] = None
    ingest_date: Optional[str] = None  # keep as string like '2022-09-01'

    # aircraft-ish fields (since aircrafts collection empty)
    model: Optional[str] = None
    registration: Optional[str] = None
    typecode: Optional[str] = None

class FlightOut(FlightIn):
    _id: str
