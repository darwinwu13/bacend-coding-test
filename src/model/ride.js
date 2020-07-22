const Database = require('sqlite-async');
const buildSchemas = require('../schemas');

class Ride {
  constructor() {
    this.connect();
  }

  async connect() {
    if (this.db === undefined) {
      this.db = await Database.open(':memory:');
      buildSchemas(this.db);
    }
  }

  async startNewRide(data) {
    await this.connect();
    const query = `INSERT INTO 
        Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    return this.db.run(query, data);
  }

  async findById(id) {
    await this.connect();
    return this.db.all('SELECT * FROM Rides WHERE rideID = ?', id);
  }

  async paginate(pageInput) {
    const size = 10;
    const page = Number(pageInput) || 1;
    const offset = (page - 1) * size;
    await this.connect();
    return this.db.all('SELECT * FROM Rides LIMIT ?,?', offset, size);
  }
}

module.exports = Ride;
