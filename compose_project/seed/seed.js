const { seedUsers, getSomeDriversUserId } = require("./usersSeed");
const { seedVehicles, getSomeVehicleIds } = require("./vehiclesSeed");
const { seedRoutes } = require("./routesSeed");

async function seed() {
  try {
    totalEntries = 1000000;
    batchSize = 10000;

    console.log(`-- Start seeding users with ${totalEntries} entries...`);
    await seedUsers(totalEntries, batchSize);

    console.log(`------ Getting some drivers userIds...`);
    const driversIds = await getSomeDriversUserId(totalEntries / 2);

    console.log(`-- Start seeding vehicles with ${totalEntries} entries...`);
    await seedVehicles(totalEntries, batchSize);

    console.log(`------ Getting some vehicleIds...`);
    const vehicleIds = await getSomeVehicleIds(totalEntries / 2);

    console.log(`-- Start seeding routes with ${totalEntries} entries...`);
    await seedRoutes(totalEntries, batchSize, driversIds, vehicleIds);

    console.log("-- Seeding process completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seed process : ", error);
    process.exit(1);
  }
}

seed();
