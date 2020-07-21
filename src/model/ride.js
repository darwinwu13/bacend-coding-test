const Database = require('sqlite-async');
const buildSchemas = require('../schemas');

class Ride {
  constructor() {
    (async () => {
      this.db = await Database.open(':memory:');
      buildSchemas(this.db);
    })();
  }

  startNewRide(data) {
    const query = `INSERT INTO 
        Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    return this.db.run(query, data);
  }

  findById(id) {
    return this.db.all('SELECT * FROM Rides WHERE rideID = ?', id);
  }

  paginate(pageInput) {
    const size = 10;
    const page = Number(pageInput) || 1;
    const offset = (page - 1) * size;
    return this.db.all('SELECT * FROM Rides LIMIT ?,?', offset, size);
  }
}

module.exports = Ride;
