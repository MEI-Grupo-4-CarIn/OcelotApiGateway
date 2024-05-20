const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { seedUsers, getSomeDriversUserId } = require("./usersSeed");
const VehiclesSeed = require("./vehiclesSeed");
const RoutesSeed = require("./routesSeed");

const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
}

async function seed() {
  try {
    const vehiclesConnection = await mongoose.createConnection(process.env.MONGO_URI_VEHICLES).asPromise();
    const routesConnection = await mongoose.createConnection(process.env.MONGO_URI_ROUTES).asPromise();

    const vehiclesSeed = new VehiclesSeed(vehiclesConnection);
    const routesSeed = new RoutesSeed(routesConnection);

    const totalEntries = 1000000;
    const batchSize = 10000;

    console.log(`-- Start seeding users with ${totalEntries} entries...`);
    await seedUsers(totalEntries, batchSize);

    console.log(`------ Getting some drivers userIds...`);
    const driversIds = await getSomeDriversUserId(totalEntries / 2);

    console.log(`-- Start seeding vehicles with ${totalEntries} entries...`);
    await vehiclesSeed.seedVehicles(totalEntries, batchSize);

    console.log(`------ Getting some vehicleIds...`);
    const vehicleIds = await vehiclesSeed.getSomeVehicleIds(totalEntries / 2);

    console.log(`-- Start seeding routes with ${totalEntries} entries...`);
    await routesSeed.seedRoutes(totalEntries, batchSize, driversIds, vehicleIds);

    console.log("-- Seeding process completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seed process : ", error);
    process.exit(1);
  }
}

seed();
