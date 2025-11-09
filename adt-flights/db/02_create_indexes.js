// db/02_create_indexes.js


// Uniqueness per flight: (icao24, departure_time)
db.flights.createIndex({ icao24:1, departure_time:1 }, { unique:true, name:"uniq_flight_key" });

// Time-windowed access patterns
db.flights.createIndex({ estdepartureairport:1, departure_time:1 }, { name:"dep_time" });
db.flights.createIndex({ estarrivalairport:1, arrival_time:1 }, { name:"arr_time" });

db.aircraft.createIndex({ icao24:1 }, { unique:true, name:"uniq_aircraft" });

db.airports.createIndex({ icao:1 }, { unique:true, name:"uniq_airport" });
db.airports.createIndex({ loc:"2dsphere" }, { name:"geo" });
