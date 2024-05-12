const mongoose = require("mongoose");
const faker = require("@faker-js/faker").faker;
const fs = require("fs");
const path = require("path");
const RouteModel = require("./models/routeModel");

const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
}

const mongoDBUri = process.env.MONGO_URI_ROUTES;

async function seedRoutes(totalEntries, batchSize, userIds, vehicleIds) {
  try {
    await mongoose
      .connect(mongoDBUri)
      .then(() => console.log("MongoDB - Routes Connected..."))
      .catch((error) => {
        throw error;
      });

    let entriesInserted = 0;
    while (entriesInserted < totalEntries) {
      const seedData = generateSeedData(batchSize, userIds, vehicleIds);
      await RouteModel.insertMany(seedData);
      entriesInserted += batchSize;
      console.log(`Inserted ${entriesInserted} entries...`);
    }
  } catch (error) {
    throw error;
  } finally {
    mongoose.connection.close();
    console.log("MongoDB - Routes Disconnected...");
  }
}

function generateSeedData(numEntries, userIds, vehicleIds) {
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

module.exports = { seedRoutes };
