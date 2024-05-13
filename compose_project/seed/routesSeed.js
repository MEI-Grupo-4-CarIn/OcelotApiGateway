const faker = require("@faker-js/faker").faker;
const RouteSchema = require("./models/routeModel");

class RoutesSeed {
  constructor(connection) {
    this.connection = connection;
    this.connection.model("Route", RouteSchema);
  }

  async seedRoutes(totalEntries, batchSize, userIds, vehicleIds) {
    try {
      let entriesInserted = 0;
      while (entriesInserted < totalEntries) {
        const seedData = this._generateSeedData(batchSize, userIds, vehicleIds);

        await this.connection.model("Route").insertMany(seedData);

        entriesInserted += batchSize;
        console.log(`Inserted ${entriesInserted} entries...`);
      }
    } catch (error) {
      throw error;
    }
  }

  _generateSeedData(numEntries, userIds, vehicleIds) {
    const seedData = [];
    for (let i = 0; i < numEntries; i++) {
      seedData.push({
        userId: userIds[Math.floor(Math.random() * userIds.length)],
        vehicleId: vehicleIds[Math.floor(Math.random() * vehicleIds.length)],
        startPoint: {
          city: faker.location.city(),
          country: faker.location.country(),
          coordinates: [faker.location.longitude(), faker.location.latitude()],
        },
        endPoint: {
          city: faker.location.city(),
          country: faker.location.country(),
          coordinates: [faker.location.longitude(), faker.location.latitude()],
        },
        startDate: faker.date.future(),
        estimatedEndDate: faker.date.future(),
        distance: faker.number.float({ min: 10, max: 500 }),
        duration: `${faker.number.int({ min: 1, max: 10 })} hours`,
        status: faker.helpers.arrayElement(["pending", "inProgress", "completed", "cancelled"], 1),
        avoidTolls: faker.datatype.boolean(),
        avoidHighways: faker.datatype.boolean(),
        isDeleted: false,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      });
    }
    return seedData;
  }
}

module.exports = RoutesSeed;
