const { DataTypes } = require("sequelize");
const sequelize = require("./connector");
const User = sequelize.define("user", {
  email: {
    type: DataTypes.STRING,
  },
});

module.exports = { User };
