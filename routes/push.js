const express = require("express");
const router = express.Router();
const webpush = require("web-push");
const admin = require("firebase-admin");
const firebase = require("firebase/compat/app");
const authMiddleware = require("../middlewares/auth-middleware");

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

var serviceAccount = require("../passport/pushnotificationtest-9e21c-firebase-adminsdk-ebja8-88145a1da6.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// body로 받아야하기 때문에 post인지 get인지 고민
// /notice/:registrationToken/users/:userIdx
// 개인 설정 시간마다 알람 보내야함
router.get("/location/:registrationToken", authMiddleware, async (req, res) => {
  const { registrationToken } = req.params;
  // const { userIdx } = req.params;
  console.log("token : ", registrationToken);
  // console.log("userIdx : ", userIdx);
  try {
    const message = {
      data: { time: "1:53" },
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
  } catch (error) {
    res.status(400).send({
      errorMessage: "알람 등록 중 오류 발생",
    });
  }
});

module.exports = router;
