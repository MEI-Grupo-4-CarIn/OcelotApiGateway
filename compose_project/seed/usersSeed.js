const sql = require("mssql");
const faker = require("@faker-js/faker").faker;
const fs = require("fs");
const path = require("path");
const User = require("./models/userModel");

const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
}

const connectionStringParts = process.env.SQL_SERVER_CONNECTION_STRING.split(";");
const sqlConfig = {};

for (const part of connectionStringParts) {
  const [key, value] = part.split("=");
  switch (key.toLowerCase()) {
    case "server":
      const [server, port] = value.split(",");
      sqlConfig.server = server;
      if (port) {
        sqlConfig.port = parseInt(port);
      }
      break;
    case "database":
      sqlConfig.database = value;
      break;
    case "user id":
      sqlConfig.user = value;
      break;
    case "password":
      sqlConfig.password = value;
      break;
    case "trustservercertificate":
      sqlConfig.options = {};
      sqlConfig.options.trustServerCertificate = value === "True";
      break;
    default:
      break;
  }
}

sqlConfig.requestTimeout = 60000;

async function seedUsers(totalEntries, batchSize) {
  const pool = new sql.ConnectionPool(sqlConfig);

  try {
    await pool.connect();

    // Define the table structure
    const table = new sql.Table("Users");
    table.columns.add("FirstName", sql.NVarChar(50), { nullable: false });
    table.columns.add("LastName", sql.NVarChar(50), { nullable: false });
    table.columns.add("Email", sql.NVarChar(100), { nullable: false });
    table.columns.add("Password", sql.NVarChar(100), { nullable: false });
    table.columns.add("BirthDate", sql.DateTime2(7), { nullable: false });
    table.columns.add("RoleId", sql.Int, { nullable: false });
    table.columns.add("Status", sql.Bit, { nullable: false });
    table.columns.add("CreationDateUtc", sql.DateTime2(7), { nullable: false, defaultValue: new Date() });
    table.columns.add("LastUpdateDateUtc", sql.DateTime2(7), { nullable: true });

    let entriesInserted = 0;
    while (entriesInserted < totalEntries) {
      // Generate users data
      const data = generateUsersData(batchSize);
      entriesInserted += data.length;

      for (let i = 0; i < data.length; i++) {
        const record = data[i];
        table.rows.add(
          record.firstName,
          record.lastName,
          record.email,
          record.password,
          record.birthDate,
          record.roleId,
          record.status,
          null,
          record.lastUpdateDateUtc
        );
      }
    }

    await new Promise((resolve, reject) => {
      const request = new sql.Request(pool);
      request.bulk(table, (error, result) => {
        if (error) {
          reject(error);
          throw error;
        } else {
          console.log("Inserted", result.rowsAffected, "rows.");
          resolve(result);
        }
      });
    });
  } catch (error) {
    throw error;
  } finally {
    pool.close();
  }
}

async function getSomeDriversUserId(maxCount) {
  const pool = new sql.ConnectionPool(sqlConfig);

  try {
    await pool.connect();

    const result = await new Promise((resolve, reject) => {
      const request = new sql.Request(pool);
      request.query(`SELECT TOP ${maxCount} userId FROM Users WHERE RoleId = 3`, (error, result) => {
        if (error) {
          reject(error);
          throw error;
        }
        resolve(result);
      });
    });

    const userIds = result.recordset.map((record) => record.userId);
    return userIds;
  } catch (error) {
    throw error;
  } finally {
    pool.close();
  }
}

function generateUsersData(numEntries) {
  const users = [];

  for (let i = 0; i < numEntries; i++) {
    users.push(
      new User(
        faker.person.firstName(),
        faker.person.lastName(),
        faker.internet.email({ provider: "carin.com" }),
        faker.internet.password({ length: 10, memorable: true }),
        faker.date.past({ years: 50 }),
        faker.number.int({ min: 1, max: 3 }), // RoleId
        1, // Status (1 = Active)
        faker.date.past(),
        faker.date.recent()
      )
    );
  }

  return users;
}

module.exports = { seedUsers, getSomeDriversUserId };
