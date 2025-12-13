import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "openair")

client = AsyncIOMotorClient(MONGODB_URI)
db = client[MONGODB_DB]

airports_col = db["airports"]
flights_col = db["flights"]
aircrafts_col = db["aircrafts"]  # may be empty
