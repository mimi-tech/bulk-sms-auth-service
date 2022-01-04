/* eslint-disable global-require */
const { Sequelize } = require("sequelize");
const { dbURL } = require("./env");


let sequelize;

(async () => {
  try {
    sequelize = new Sequelize(dbURL, {
      dialect: "postgres",
      dialectOptions: {
        ssl: process.env.DB_ENABLE_SSL === "true" &&{
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    });


    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    const schemas = require("../models");
  
  

    Object.keys(schemas).forEach(schema => {
      schemas[schema].sync({ alter: true });
    });

    console.log("Migrated");
  } catch (error) {
    console.error(`Unable to connect to the database${  error}`);
  }
})();

module.exports = { sequelize };
