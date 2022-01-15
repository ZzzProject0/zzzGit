const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../schemas/users");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middlewares/auth-middleware");
const Joi = require("joi");

// 회원가입 검증
const registerSchema = Joi.object({
  userId: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{5,10}$")).required(),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$"))
    .required(),
});

// 회원가입
router.post("/register", async (req, res) => {
  try {
    const recentUser = await User.find().sort("-userIdx").limit(1);
    let userIdx = 1;
    if (recentUser.length != 0) {
      userIdx = recentUser[0]["userIdx"] + 1;
    }

    let loginCnt = 0;

    let noticeSet = false;

    const { userId, password } = await registerSchema.validateAsync(req.body);
    if (userId === password) {
      res.status(400).send({
        errorMessage: "아이디, 비밀번호가 같습니다.",
      });
      return;
    }

    const userID = await User.find({ userId: userId });
    if (userID.length !== 0) {
      res.status(400).send({
        errorMessage: "아이디가 중복되었습니다.",
      });
      return;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdAt = new Date(+new Date() + 3240 * 10000)
      .toISOString()
      .replace("T", " ")
      .replace(/\..*/, "");

    await User.create({
      userIdx,
      userId,
      hashedPassword,
      createdAt,
      loginCnt,
      noticeSet,
    });

    res.status(201).send({
      retult: "회원가입 완료",
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "입력한 내용을 다시 확인 해주세요.",
    });
  }
});

// 로그인 검증
const loginSchema = Joi.object({
  userId: Joi.string().required(),
  password: Joi.string().required(),
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    const { userId, password } = await loginSchema.validateAsync(req.body);
    const user = await User.findOne({ userId }).exec();
    const userIdx = user["userIdx"];
    const noticeSet = user["noticeSet"];

    if (!user) {
      res.status(400).send({
        errorMessage: "아이디 또는 비밀번호를 확인해주세요",
      });
      return;
    }

    const authenticate = await bcrypt.compare(password, user.hashedPassword);

    if (authenticate === true) {
      const token = jwt.sign({ userIdx: user.userIdx }, "my-secret-key");
      // 0이면 1 생성 아니면 +1 업데이트
      let loginCnt = user.loginCnt + 1;
      await User.updateOne({ userId }, { $set: { loginCnt } });

      res.status(200).send({
        result: "success",
        userIdx,
        userId,
        loginCnt,
        noticeSet,
        token,
      });
    } else {
      res.status(401).send({
        errorMessage: "아이디 또는 비밀번호를 확인해주세요",
      });
      return;
    }
  } catch (err) {
    res.status(400).send({
      errorMessage: "입력한 내용을 다시 확인해주세요",
    });
    return;
  }
});

// 로그인 인증
router.get("/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user: {
      userIdx: user.userIdx,
    },
  });
});

// id = req.body String
// token = req.body String?
// 1. access token 사용  2. jwt 생성하여 사용
// 로그인
// id 존재하면 {userIdx, userId, loginCnt, noticeSet, token}
// 회원가입 > 로그인
// id 존재하지 않으면 생성하여 {userIdx, userId, loginCnt, noticeSet, token} 출력
// 카카오 로그인
router.post("/kakaoLogin", async (req, res) => {
  try {
    const { id } = req.body;
    const userId = id;
    const user = await User.findOne({ userId: userId }).exec();
    if (user) {
      let loginCnt = user.loginCnt + 1;
      await User.updateOne({ userId }, { $set: { loginCnt } });
      let token = jwt.sign({ userIdx: user.userIdx }, "my-secret-key");

      const userInfo = {
        userIdx: user.userIdx,
        userId: user.userId,
        noticeSet: user.noticeSet,
        loginCnt,
        token,
      };
      res.status(200).send({
        userInfo,
      });
      return;
    } else {
      const recentUser = await User.find().sort("-userIdx").limit(1);
      let userIdx = 1;
      if (recentUser.length != 0) {
        userIdx = recentUser[0].userIdx + 1;
      }

      let loginCnt = 0;

      const noticeSet = false;

      const createdAt = new Date(+new Date() + 3240 * 10000)
        .toISOString()
        .replace("T", " ")
        .replace(/\..*/, "");

      const newUser = await User.create({
        userIdx,
        userId,
        createdAt,
        loginCnt,
        noticeSet,
      });
      let token = jwt.sign({ userIdx: user.userIdx }, "my-secret-key");

      const userInfo = {
        userIdx: newUser.userIdx,
        userId: newUser.userId,
        loginCnt: newUser.loginCnt,
        noticeSet: newUser.noticeSet,
        token,
      };
      res.status(200).send({
        userInfo,
      });
      return;
    }
  } catch (err) {
    res.status(400).send({
      errorMessage: "입력한 내용을 다시 확인해주세요",
    });
    return;
  }
});

module.exports = router;
