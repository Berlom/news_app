const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "a78c06a9747546",
    pass: "2bc60c88cb39df",
  },
});
module.exports = transporter;
