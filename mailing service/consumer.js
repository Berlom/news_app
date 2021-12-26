const { Kafka } = require("kafkajs");
const transporter = require("./transporter");
const sequelize = require("./connector");

let mailOptions = {
  from: "berlom69@gmail.com",
  subject: "test subject",
};
module.exports = async () => {
  const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"],
  });
  const consumer = kafka.consumer({ groupId: "test-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "test", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      // console.log({
      //   value: message.value.toString(),
      // });

      // const body = JSON.parse(message.value.toString());
      mailOptions = { ...mailOptions, text: message.value.toString() };
      const result = await sequelize.query("select email from users");
      result[0].map((elt) => {
        mailOptions = { ...mailOptions, to: elt.email };
        transporter.sendMail(mailOptions, (err, inf) => {
          err ? console.log(err) : console.log(inf.response);
        });
      });
    },
  });
  // consumer.seek({ topic: "test", partition: 0, offset: "0" });
};
