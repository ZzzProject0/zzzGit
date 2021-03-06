const express = require("express");
const router = express.Router();
const moment = require("moment");
const Diary = require("../schemas/diaries");
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/diaries", authMiddleware, async (req, res) => {
  const { yearMonth, day, feelScore, sleepScore, comment } = req.body;
  const { user } = res.locals;
  const { userIdx } = user;

  try {
    const recentDiary = await Diary.find().sort("-diaryIdx").limit(1);
    let diaryIdx = 1;
    if (recentDiary.length !== 0) {
      diaryIdx = recentDiary[0].diaryIdx + 1;
    }
    let strDay = "";
    const zeroDay = "0";
    if (day < 10) {
      strDay = zeroDay + String(day);
    } else {
      strDay = String(day);
    }
    const input = `${yearMonth.substring(0, 4)}-${yearMonth.substring(
      4
    )}-${strDay}`;
    const inputDate = moment(input).format("YYYY-MM-DD");
    const createdAt = new Date(+new Date() + 3240 * 10000)
      .toISOString()
      .replace("T", " ")
      .replace(/\..*/, "");
    const scoreAvg = feelScore + sleepScore;

    await Diary.create({
      diaryIdx,
      userIdx,
      yearMonth,
      day,
      feelScore,
      sleepScore,
      comment,
      createdAt,
      inputDate,
      scoreAvg,
    });

    res.status(201).send({
      diaryIdx,
      day,
      feelScore,
      sleepScore,
      comment,
    });
    return;
  } catch (error) {
    res.status(400).json({
      errorMessage: "수면 기록 등록 중 오류 발생",
    });
  }
});

router.get(
  "/diaries/:yearMonth/users/:userIdx",
  authMiddleware,
  async (req, res) => {
    const { userIdx } = req.params;
    const { yearMonth } = req.params;
    const { user } = res.locals;
    try {
      const arrIdx = [parseInt(userIdx)];
      const userIdxDb = await Diary.find(
        { userIdx },
        { _id: 0, userIdx: 1 }
      ).exec();
      const userIdxDbobj = { userIdxDb };
      const arrIdxDb = new Array();
      for (let z = 0; z < userIdxDbobj.userIdxDb.length; z++) {
        arrIdxDb.push(parseInt(userIdxDbobj.userIdxDb[z].userIdx));
      }
      const intersectionIdx = arrIdxDb.filter((x) => arrIdx.includes(x));

      if (intersectionIdx.length === 0) {
        res.status(206).send({
          errorMessage: "기록 없는 유저",
        });
        return;
      }

      const diaryUser = await Diary.findOne({ userIdx });
      const tokenUser = user.userIdx;
      const dbUser = diaryUser.userIdx;
      if (tokenUser === dbUser) {
        // DB 가져옴
        const getDiary = await Diary.find(
          { userIdx, yearMonth },
          {
            _id: 0,
            diaryIdx: 1,
            day: 1,
            feelScore: 1,
            sleepScore: 1,
            comment: 1,
          }
        ).sort("day");

        res.status(200).send(getDiary);
      } else {
        res.status(403).send({
          errorMessage: "권한 없음",
        });
      }
      return;
    } catch (error) {
      res.status(400).send({
        errorMessage: "수면 기록 불러오기 중 오류 발생",
      });
    }
  }
);

router.put("/diaries/:diaryIdx", authMiddleware, async (req, res) => {
  const { diaryIdx } = req.params;
  const { user } = res.locals;
  const { feelScore, sleepScore, comment } = req.body;

  try {
    const diaryUser = await Diary.findOne({ diaryIdx });
    const tokenUser = user.userIdx;
    const dbUser = diaryUser.userIdx;

    if (tokenUser == dbUser) {
      const scoreAvg = feelScore + sleepScore;
      const updatedAt = new Date(+new Date() + 3240 * 10000)
        .toISOString()
        .replace("T", " ")
        .replace(/\..*/, "");
      await Diary.updateOne(
        { diaryIdx },
        {
          $set: {
            feelScore,
            sleepScore,
            comment,
            scoreAvg,
            updatedAt,
          },
        }
      );
      res.status(200).send({
        result: "기록 수정 완료",
      });
      return;
    }
    res.status(401).send({
      errorMessage: "권한 없음",
    });
    return;
  } catch (error) {
    res.status(400).send({
      errorMessage: "기록 수정 중 오류가 발생했습니다.",
    });
  }
});

router.delete("/diaries/:diaryIdx", authMiddleware, async (req, res) => {
  const { diaryIdx } = req.params;
  const { user } = res.locals;

  try {
    const diaryUser = await Diary.findOne({ diaryIdx });
    const tokenUser = user.userIdx;
    const dbUser = diaryUser.userIdx;

    if (tokenUser === dbUser) {
      await Diary.deleteOne({ diaryIdx });
      res.status(200).send({
        result: "기록 삭제 완료",
      });
      return;
    }
    res.status(401).send({
      errorMessage: "권한 없음",
    });
    return;
  } catch (error) {
    res.status(400).send({
      errorMessage: "기록 삭제 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
