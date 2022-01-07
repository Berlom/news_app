const { Kafka } = require("kafkajs");
var fs = require("fs");
const handlebars = require("handlebars");
const transporter = require("./transporter");
const sequelize = require("./connector");

let mailOptions = {
  from: "berlom69@gmail.com",
  subject: "Checkout Latest News",
};

module.exports = async () => {
  try {
    const kafka = new Kafka({
      clientId: "my-app",
      brokers: ["localhost:9092"],
    });
    const consumer = kafka.consumer({
      groupId: "test-group",
    });
    await consumer.connect();
    await consumer.subscribe({ topic: "test" });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value.toString(),
        });

        const body = JSON.parse(message.value.toString());
        console.log(body);

        fs.readFile("./mail.html", { encoding: "utf-8" }, (err, html) => {
          if (err) console.log(err);
          else {
            var template = handlebars.compile(html);
            var replacements = {
              title: body.title,
              description: body.description,
              date: body.date,
              category: body.category,
              author: body.author,
            };
            var htmlToSend = template(replacements);
            mailOptions = { ...mailOptions, html: htmlToSend };
          }
        });

        // mailOptions = { ...mailOptions, text: body.titre };
        console.log(mailOptions);
        const result = await sequelize.query(
          "select email from users where categories like ?",
          { replacements: ["%" + body.category + "%"] }
        );
        result[0].map((elt) => {
          mailOptions = { ...mailOptions, to: elt.email };
          transporter.sendMail(mailOptions, (err, inf) => {
            err ? console.log(err) : console.log(inf.response);
          });
        });
      },
    });
    // consumer.seek({ topic: "test", partition: 0, offset: "0" });
  } catch (error) {
    console.log("err");
  }
};
