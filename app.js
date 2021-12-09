const express = require("express");

const app = express();
const { User } = require("./User");

// const consumer = require("./consumer");
// consumer().catch((err) => {
//   console.log(err);
// });

const sequelize = require("./connector");
sequelize.sync();
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(3369, () => {
  console.log("connected on port", 3369);
});
