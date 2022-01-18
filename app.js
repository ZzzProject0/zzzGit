const express = require("express");
const bodyParser = require("body-parser");
const passportConfig = require("./passport");
const webpush = require("web-push");
const cors = require("cors");

const app = express();
app.use(cors());
passportConfig();

const http = require("http");
const https = require("https");
const passport = require("passport");
const session = require("express-session");
const port = 3000;
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
require("dotenv").config();

const userRouter = require("./routes/user");
const noticeRouter = require("./routes/notice");
const diaryRouter = require("./routes/diary");
const asmrRouter = require("./routes/asmr");
const playlistRouter = require("./routes/playlist");
const authRouter = require("./routes/auth");
const scoresRouter = require("./routes/score");
const pushRouter = require("./routes/push");

const connect = require("./schemas");

connect();

app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
webpush.setVapidDetails(
  "mailto: www.zzzapp.co.kr",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

app.get("/", (req, res) => {
  res.send("Welcome to API server start");
});

// const options = {
//   // letsencrypt로 받은 인증서 경로를 입력
//   ca: fs.readFileSync("/etc/letsencrypt/live/www.zzzback.shop/fullchain.pem"),
//   key: fs.readFileSync("/etc/letsencrypt/live/www.zzzback.shop/privkey.pem"),
//   cert: fs.readFileSync("/etc/letsencrypt/live/www.zzzback.shop/cert.pem"),
// };

app.use("/api", express.urlencoded({ extended: false }), userRouter);
app.use("/api", express.urlencoded({ extended: false }), noticeRouter);
app.use("/api", express.urlencoded({ extended: false }), diaryRouter);
app.use("/api/asmrTracks", express.urlencoded({ extended: false }), asmrRouter);
app.use("/api", express.urlencoded({ extended: false }), scoresRouter);
app.use(
  "/api/playlists",
  express.urlencoded({ extended: false }),
  playlistRouter
);
app.use("/auth", express.urlencoded({ extended: false }), authRouter);
app.use("/api", express.urlencoded({ extended: false }), pushRouter);

// 18.117.86.112
// http.createServer(app).listen(port);
// https.createServer(options, app).listen(443);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

module.exports = app;
