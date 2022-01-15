const express = require("express");
const router = express.Router();
const webpush = require("web-push");
const admin = require("../admin");

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
  const message = {
    data: {
      score: "850",
      time: "2:45",
    },
    token: registrationToken,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
      res.send(response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      res.send(error);
    });
});

module.exports = router;
