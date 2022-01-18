const express = require("express");
const router = express.Router();
const webpush = require("web-push");
const admin = require("../admin");
// const serverKey ="AAAA7XUdSMQ:APA91bHiG3ONselw3DtnFO6-7Z2hPZq_qh9zQihBUnkrpebWvTNvSv1J8d5jQI4RgH3b7wXXlwQoQSTytd_lvwnFBeVkyV3-ShUa0HL_mpmcuBckF5bLlxhDertxC8YsONjZVntYrCk2";

router.post("/notifications/subscribe", async (req, res) => {
  console.log(req.body);
  const payload = JSON.stringify({
    title: req.body.title,
    description: req.body.description,
    icon: req.body.icon,
  });
  console.log(req.body.subscription);
  webpush
    .sendNotification(req.body.subscription, payload)
    .then((result) => console.log())
    .catch((e) => console.log(e.stack));
  res.status(200).json({ success: true });
});

router.get("/location", (req, res) => {
  const { registrationToken } = req.body;
  console.log("token:", registrationToken);
  const message = {
    notification: {
      title: "푸시알림 테스트",
      body: "푸시알림 테스트입니다.",
    },
    token: registrationToken,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      res.status(400).send(error);
    });
});

module.exports = router;
