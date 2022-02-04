const express = require("express");

const router = express.Router();
const moment = require("moment");
const Diary = require("../schemas/diaries");
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/scores/users/:userIdx", authMiddleware, async (req, res) => {
  const { userIdx } = req.params;
  const { user } = res.locals;
  try {
    // Diary schema에 해당 User DB 존재하는지 파악
    const userIdxDb = await Diary.find(
      { userIdx },
      { _id: 0, userIdx: 1 }
    ).exec();

    const arrIdxDb = new Array();
    for (let z = 0; z < { userIdxDb }.userIdxDb.length; z++) {
      arrIdxDb.push(parseInt({ userIdxDb }.userIdxDb[z].userIdx));
    }

    if (arrIdxDb.length === 0) {
      res.status(206).send({
        errorMessage: "기록 없는 유저",
      });
      return;
    }

    const diaryUser = await Diary.findOne({ userIdx });
    const tokenUser = user.userIdx;
    const dbUser = diaryUser.userIdx;
    if (tokenUser === dbUser) {
      const monthDiary = await Diary.find(
        { userIdx },
        {
          _id: 0,
          yearMonth: 1,
          day: 1,
          scoreAvg: 1,
          inputDate: 1,
        }
      ).sort("inputDate"); // [{ yearMonth: '2022-1', day: 1, sleepScore: 4 }]

      const nowDate = new Date(+new Date() + 3240 * 10000); // 현재 날짜 yyyymmdd
      const nowDay = nowDate.getDay(); // 현재 요일

      function zero(nowDay) {
        let result = "";
        const arrDbDate = new Array(); // DB중 day 배열에 넣기
        for (let a = 0; a < { monthDiary }.monthDiary.length; a++) {
          arrDbDate.push({ monthDiary }.monthDiary[a].inputDate);
        }

        // 이번주
        let thisMonDd = 0;
        if (nowDay === 0) {
          thisMonDd = nowDate.getDate() - 6;
        } else {
          thisMonDd = nowDate.getDate() - nowDay + 1;
        }
        const nowDdForm = Number(moment().format("DD")); // 현재 날짜
        const thisBetween = nowDdForm - thisMonDd;
        const thisMonDate = new Date(+new Date() + 3240 * 10000);
        if (nowDay === 0) {
          thisMonDate.setDate(thisMonDate.getDate() - 6);
        } else {
          thisMonDate.setDate(thisMonDate.getDate() - nowDay + 1);
        }
        const thisMonDateForm = moment(thisMonDate).format("YYYY-MM-DD");

        const arrThisWeek = new Array(); // 이번주 월요일부터 현재 arr에 담기
        for (let b = 0; b <= thisBetween; b++) {
          const bThis = moment(thisMonDateForm)
            .add(b, "days")
            .format("YYYY-MM-DD");
          arrThisWeek.push(bThis);
        }

        const thisWeekDb = arrThisWeek.filter((x) => arrDbDate.includes(x)); // 이번주 기록 dd 찾기(교집합)

        if (thisWeekDb.length === 0) {
          result += "이번주 기록이 없어요 8ㅅ8";
        } else {
          // 저번주
          const lastMonDate = moment()
            .subtract(nowDay + 6, "days")
            .format("YYYY-MM-DD");
          const arrLastWeek = new Array(); // 저번주 1주일 배열로 만들어 나열
          for (let c = 0; c < 7; c++) {
            const bLast = moment(lastMonDate)
              .add(c, "days")
              .format("YYYY-MM-DD");
            arrLastWeek.push(bLast);
          }

          const lastWeekDb = arrLastWeek.filter((x) => arrDbDate.includes(x)); // 저번주 기록 dd 찾기(교집합)

          if (lastWeekDb.length === 0) {
            result += "저번주 기록이 없어요 8ㅅ8";
          } else {
            const arrThisScore = new Array(); // this dd 해당하는 score 가져와 배열에 담기
            for (const d of thisWeekDb) {
              const thisPicDay = monthDiary.filter(
                (pic1) => pic1.inputDate == String(d)
              );
              const thisPic = thisPicDay[0].scoreAvg;
              arrThisScore.push(thisPic);
            }

            const thisPicScore = arrThisScore.reduce(
              (sum, currVale) => sum + currVale,
              0
            );
            const thisAvg = Number(
              (thisPicScore / arrThisScore.length).toFixed(1)
            ); // this 누적 평균

            const arrLastScore = new Array(); // last dd 해당하는 score 가져와 배열에 담기
            for (const e of lastWeekDb) {
              const lastPicDay = monthDiary.filter(
                (pic2) => pic2.inputDate == String(e)
              );
              const lastPic = lastPicDay[0].scoreAvg;
              arrLastScore.push(lastPic);
            }

            const lastPicScore = arrLastScore.reduce(
              (sum, currVale) => sum + currVale,
              0
            );
            const lastAvg = Number(
              (lastPicScore / arrLastScore.length).toFixed(1)
            ); // last 누적 평균

            //  4/2 = 2배, *100 = 200% || *100 -100 = 100%
            if (lastAvg > thisAvg) {
              const lastA = (lastAvg - thisAvg) * 10;
              result += `저번주가 이번주 보다 ${parseInt(
                lastA
              )}% 잠을 더 잘 주무셨네요`;
            } else if (lastAvg === thisAvg) {
              result += "오늘은 저번주보다 더 잘 자기로 해요";
            } else {
              const thisA = (thisAvg - lastAvg) * 10;
              result += `저번주보다 ${parseInt(thisA)}% 잠을 더 잘 주무셨네요`;
            }
          }
        }
        return result;
      }
      const sleepAvg = zero(nowDay);
      res.status(200).send({ sleepAvg });
    } else {
      res.status(403).send({
        errorMessage: "권한 없음",
      });
    }
    return;
  } catch (error) {
    res.status(400).send({
      errorMessage: "수면 통계 불러오기 중 오류 발생",
    });
  }
});

module.exports = router;
