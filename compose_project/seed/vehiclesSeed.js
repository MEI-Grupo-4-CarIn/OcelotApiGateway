const mongoose = require("mongoose");
const faker = require("@faker-js/faker").faker;
const fs = require("fs");
const path = require("path");
const VehicleModel = require("./models/vehicleModel");

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
}

const mongoDBUri = process.env.MONGO_URI_VEHICLES;

async function seedVehicles(totalEntries, batchSize) {
  try {
    await mongoose
      .connect(mongoDBUri)
      .then(() => console.log("MongoDB - Vehicles Connected..."))
      .catch((error) => {
        throw error;
      });

    let entriesInserted = 0;
    while (entriesInserted < totalEntries) {
      const seedData = generateSeedData(batchSize);
      await VehicleModel.insertMany(seedData);
      entriesInserted += batchSize;
      console.log(`Inserted ${entriesInserted} entries...`);
    }
  } catch (error) {
    throw error;
  } finally {
    mongoose.connection.close();
    console.log("MongoDB - Vehicles Disconnected...");
  }
}

async function getSomeVehicleIds(maxCount) {
  try {
    await mongoose
      .connect(mongoDBUri)
      .then(() => console.log("MongoDB - Vehicles Connected..."))
      .catch((error) => {
        throw error;
      });

    const vehicles = await VehicleModel.find({}).limit(maxCount);
    const vehicleIds = vehicles.map((vehicle) => vehicle._id);

    return vehicleIds;
  } catch (error) {
    throw error;
  } finally {
    mongoose.connection.close();
    console.log("MongoDB - Vehicles Disconnected...");
  }
}

function generateSeedData(numEntries) {
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
      status: faker.helpers.arrayElement(["none", "permanent", "inUse", "repairing"], 1),
      isDeleted: false,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }
  return seedData;
}

module.exports = { seedVehicles, getSomeVehicleIds };
