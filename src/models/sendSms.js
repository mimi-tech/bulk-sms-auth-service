const { DataTypes } = require("sequelize");

module.exports = (db) => {
  const schema = db.define(
    "SendSmsUsers",
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false},
      
      messageCount: { type: DataTypes.INTEGER, defaultValue: 0},
      recievers: { type: DataTypes.INTEGER, defaultValue: 0},
      phoneNumber: { type: DataTypes.STRING, allowNull: false,unique: true},
      fullName: { type: DataTypes.STRING, allowNull: true},
      blocked: { type: DataTypes.BOOLEAN, defaultValue: false},
      wallet: { type: DataTypes.DOUBLE, defaultValue: 0.0},
      
    },
    {
      timestamps: true,
      tableName: "sendSmsUsers",
    }
  );
  schema.prototype.transform = function (admin) {
    let cols = [
    "id",
    "email",
    "password",
    "username",
    "gender",
    "country",
    "state",
    "city",
    "town",
    "roadName",
    "roadNumber",
    "phoneNumber",
    "fullname",
    "blocked",
    "wallet"
        
  
  ];
    cols = admin ? [...cols, "createdAt"] : cols;
    const data = {};
    cols.forEach((v) => {
      data[v] = this.dataValues[v];
    });
    return data;
  };
  
  return schema;
};
