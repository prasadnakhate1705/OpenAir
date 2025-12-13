from bson import ObjectId

def oid_str(doc: dict) -> dict:
    """Convert Mongo _id ObjectId to string for JSON."""
    if doc and "_id" in doc and isinstance(doc["_id"], ObjectId):
        doc["_id"] = str(doc["_id"])
    return doc
