const express = require("express");

const router = express.Router();
const Notice = require("../schemas/notice");
const User = require("../schemas/users");
const authMiddleware = require("../middlewares/auth-middleware");

const admin = require("firebase-admin");
const firebase = require("firebase/compat/app");
const schedule = require("node-schedule");

var serviceAccount = require("../passport/pushnotificationtest-9e21c-firebase-adminsdk-ebja8-88145a1da6.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 알람 팝업 등록
router.post("/notice", authMiddleware, async (req, res) => {
  const { sleepChk, timePA, hour, min, pushToken } = req.body;
  const { user } = res.locals;
  const { userIdx } = user;

  try {
    const recentNotice = await Notice.find().sort("-noticeIdx").limit(1);
    let noticeIdx = 1;
    if (recentNotice.length !== 0) {
      noticeIdx = recentNotice[0].noticeIdx + 1;
    }

    const createdAt = new Date(+new Date() + 3240 * 10000)
      .toISOString()
      .replace("T", " ")
      .replace(/\..*/, "");

    await Notice.create({
      noticeIdx,
      userIdx,
      sleepChk,
      timePA,
      hour,
      min,
      createdAt,
    });
    await User.updateOne({ userIdx }, { $set: { noticeSet: true } });
    console.log("DB create OK");
    //  push alarm?
    let newH = 0;
    timePA === "PM" ? (newH = hour + 12) : (newH = hour);

    let idx = String(userIdx);

    let pushSet = "0 " + min + " " + newH + " * * *";
    if (sleepChk === false) {
      schedule.cancelJob(userIdx);
    } else {
      let job1 = schedule.scheduleJob(idx, pushSet, async () => {
        console.log("pushToken : ", pushToken);
        const message = {
          notification: {
            title: "Zzz 알림",
            body: "잘 주무셨나요?\n기록할 시간이에요",
          },
          token: pushToken,
        };
        console.log("post 1");
        try {
          console.log("post 2 try");
          await admin
            .messaging()
            .send(message)
            .catch((error) => {
              console.log("Error sending message:", error);
            });
        } catch (error) {
          res.status(400).send({
            errorMessage: "알람 발송 중 오류 발생",
          });
        }
      });
    }
    res.status(201).send({
      result: "알람 설정 완료",
    });
    return;
  } catch (error) {
    res.status(400).send({
      errorMessage: "알람 등록 중 오류 발생 ",
    });
  }
});

// 알람 정보
router.get("/notice/users/:userIdx", authMiddleware, async (req, res) => {
  const { userIdx } = req.params;
  const { user } = res.locals; // 토큰 user
  const noticeUser = await Notice.findOne({ userIdx }); // param으로 notice.userIdx
  const tokenUser = user.userIdx;
  const dbUser = noticeUser.userIdx;

  try {
    if (tokenUser === dbUser) {
      const notice = await Notice.find(
        { userIdx },
        {
          _id: 0,
          noticeIdx: 1,
          sleepChk: 1,
          timePA: 1,
          hour: 1,
          min: 1,
          createdAt: 1,
        }
      );
      res.status(200).send(notice);
    } else {
      res.status(403).send({
        errorMessage: "권한 없음",
      });
    }
    return;
  } catch (error) {
    res.status(400).send({
      errorMessage: "정보 불러오기 중 오류 발생",
    });
  }
});

router.put("/notice/users/:userIdx", authMiddleware, async (req, res) => {
  const { userIdx } = req.params;
  const { sleepChk, timePA, hour, min, pushToken } = req.body;
  const { user } = res.locals; // 토큰 user
  const noticeUser = await Notice.findOne({ userIdx }); // param으로 notice.userIdx
  const tokenUser = user.userIdx;
  const dbUser = noticeUser.userIdx;

  try {
    if (tokenUser === dbUser) {
      await Notice.updateOne(
        { userIdx },
        {
          $set: {
            sleepChk,
            timePA,
            hour,
            min,
          },
        }
      );
      console.log("DB update OK");
      //  push alarm?
      let newH = 0;
      timePA === "PM" ? (newH = hour + 12) : (newH = hour);

      // 19일 16:23 -> 1:23
      let pushSet = "0 " + min + " " + newH + " * * *";
      if (sleepChk === false) {
        schedule.cancelJob(userIdx);
      } else {
        // schedule.gracefulShutdown();
        schedule.cancelJob(userIdx);

        let job2 = schedule.scheduleJob(userIdx, pushSet, async () => {
          console.log("pushToken : ", pushToken);
          const message = {
            notification: {
              title: "Zzz 알림",
              body: "잘 주무셨나요?\n기록할 시간이에요",
            },
            token: pushToken,
          };
          console.log("put 1");
          try {
            console.log("put 2 try");
            await admin
              .messaging()
              .send(message)
              .catch((error) => {
                console.log("Error sending message:", error);
              });
          } catch (error) {
            res.status(400).send({
              errorMessage: "알람 발송 중 오류 발생",
            });
          }
        });
      }

      // var job = schedule.scheduledJobs[userIdx];
      // console.log(job.name);
      // // job.cancel();
      // var list = new Array();
      // list.push(job.name);
      // console.log(list);

      res.status(201).send({
        result: "알람 정보 수정 완료",
      });
    } else {
      res.status(403).send({
        errorMessage: "권한 없음",
      });
    }
    return;
  } catch (error) {
    res.status(400).send({
      errorMessage: "알람 정보 수정 중 오류 발생",
    });
  }
});

module.exports = router;
