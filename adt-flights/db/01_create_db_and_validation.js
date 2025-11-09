// db/01_create_db_and_validation.js
// Create DB + validation (use BSON Date for times)

db.createCollection("flights", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["icao24","callsign","estdepartureairport","estarrivalairport","departure_time","arrival_time"],
      properties: {
        icao24: { bsonType: "string", pattern: "^[0-9a-f]{6}$", description: "hex transponder (lowercase)" },
        callsign: { bsonType: "string", minLength: 1 },
        estdepartureairport: { bsonType: "string", pattern: "^[A-Z0-9]{4}$" },
        estarrivalairport:   { bsonType: "string", pattern: "^[A-Z0-9]{4}$" },
        departure_time: { bsonType: "date" },   // BSON Date
        arrival_time:   { bsonType: "date" },   // BSON Date
        duration_min:   { bsonType: ["int","long","double"], minimum: 0 },
        model:          { bsonType: ["string","null"] },
        typecode:       { bsonType: ["string","null"] },
        registration:   { bsonType: ["string","null"] },
        ingest_date:    { bsonType: ["string","null"] }
      }
    }
  }
});

db.createCollection("aircraft", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["icao24"],
      properties: {
        icao24: { bsonType: "string", pattern: "^[0-9a-f]{6}$" },
        registration: { bsonType: ["string","null"] },
        model: { bsonType: ["string","null"] },
        typecode: { bsonType: ["string","null"] },
        last_seen: { bsonType: ["date","null"] }
      }
    }
  }
});

db.createCollection("airports", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["icao","loc"],
      properties: {
        icao: { bsonType: "string", pattern: "^[A-Z0-9]{4}$" },
        name: { bsonType: ["string","null"] },
        city: { bsonType: ["string","null"] },
        country: { bsonType: ["string","null"] },
        loc: {
          bsonType: "object",
          required: ["type","coordinates"],
          properties: {
            type: { enum: ["Point"] },
            coordinates: {
              bsonType: "array",
              items: [{bsonType:"double"},{bsonType:"double"}],
              minItems: 2, maxItems: 2
            }
          }
        }
      }
    }
  }
});
