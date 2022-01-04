/* eslint-disable global-require */
const {
    db: { sequelize },
  } = require("../configs");
  
  module.exports = {
    SendSmsUsers: require("./sendSms")(sequelize),
    
  };

 
  