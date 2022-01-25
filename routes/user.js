const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../schemas/users");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middlewares/auth-middleware");
const Joi = require("joi");
const dotenv = require("dotenv");

dotenv.config();
const jwtKey = process.env.JWT_TOKEN;
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

    const authenticate = await bcrypt.compare(password, user.hashedPassword); // 비밀번호 매치 검사

    if (authenticate === true) {
      const token = jwt.sign({ userIdx: user.userIdx }, jwtKey);
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

router.post("/kakaoLogin", async (req, res) => {
  try {
    const { id } = req.body;
    const userId = id;
    let user = await User.findOne({ userId }).exec();
    if (!user) {
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

      await User.create({
        userIdx,
        userId,
        createdAt,
        loginCnt,
        noticeSet,
      });
    }
    let userDb = await User.findOne({ userId }).exec();

    let loginCnt = userDb.loginCnt + 1;
    await User.updateOne({ userId }, { $set: { loginCnt } });

    let token = jwt.sign({ userIdx: userDb.userIdx }, jwtKey);

    const userInfo = {
      userIdx: userDb.userIdx,
      userId: userDb.userId,
      loginCnt: userDb.loginCnt,
      noticeSet: userDb.noticeSet,
      token,
    };

    res.status(200).send({
      userInfo,
    });
    return;
  } catch (err) {
    res.status(400).send({
      errorMessage: "입력한 내용을 다시 확인해주세요",
    });
    return;
  }
});

module.exports = router;
