const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("tp_middleware", "root", "", {
  dialect: "mysql",
  host: "localhost",
});
// sequelize
//   .authenticate()
//   .then((res) => {
//     console.log(res);
//   })
//   .then((err) => {
//     console.log(err);
//   });
module.exports = sequelize;
