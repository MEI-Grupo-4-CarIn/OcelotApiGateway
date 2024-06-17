const faker = require("@faker-js/faker").faker;
const VehicleSchema = require("./models/vehicleModel");

class VehiclesSeed {
  constructor(connection) {
    this.connection = connection;
    this.connection.model("Vehicle", VehicleSchema);
  }

  async seedVehicles(totalEntries, batchSize) {
    try {
      let entriesInserted = 0;
      while (entriesInserted < totalEntries) {
        const seedData = this._generateSeedData(batchSize);

        await this.connection.model("Vehicle").insertMany(seedData);

        entriesInserted += batchSize;
        console.log(`Inserted ${entriesInserted} entries...`);
      }
    } catch (error) {
      throw error;
    }
  }

  async getSomeVehicleIds(maxCount) {
    try {
      const vehicles = await this.connection.model("Vehicle").find({}).limit(maxCount).lean();
      const vehicleIds = vehicles.map((vehicle) => vehicle._id);

      return vehicleIds;
    } catch (error) {
      throw error;
    }
  }

  _generateSeedData(numEntries) {
    const seedData = [];
    for (let i = 0; i < numEntries; i++) {
      seedData.push({
        model: faker.vehicle.model(),
        brand: faker.vehicle.manufacturer(),
        licensePlate: faker.string.alphanumeric({ casing: "upper", length: 10 }),
        vin: faker.vehicle.vin(),
        color: faker.vehicle.color(),
        registerDate: faker.date.past(),
        acquisitionDate: faker.date.past(),
        category: faker.vehicle.type(),
        kms: faker.number.int({ min: 100, max: 500000 }),
        capacity: faker.number.int({ min: 1, max: 9 }),
        fuelType: faker.helpers.arrayElement(["diesel", "petrol", "electric"], 1),
        averageFuelConsumption: faker.number.float({ min: 3, max: 20, multipleOf: 0.01 }),
        status: faker.helpers.arrayElement(["none", "inUse", "repairing"], 1),
        isDeleted: false,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      });
    }
    return seedData;
  }
}

module.exports = VehiclesSeed;
