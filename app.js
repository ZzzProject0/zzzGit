const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// let whitelist = [
//   "https://www.zzzback.shop",
//   "http://www.zzzback.shop",
//   "https://www.zzzapp.co.kr",
//   "http://www.zzzapp.co.kr",
//   "http://localhost:3000",
//   "https://zzzapp.co.kr",
//   "https://push-e53ad.web.app",
//   "https://zzz-pwa.web.app",
//   "https://zzz-pwa.firebaseapp.com",
//   "https://pushnotificationtest-9e21c.firebaseapp.com",
// ];
// // // whitelist들을 비동기로 처리하는 option 설정
// let corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   Credential: true,
// };
const app = express();
// app.use(cors(corsOptions));
app.use(cors()); // dev

const http = require("http");
const https = require("https");
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
const scoresRouter = require("./routes/score");

const connect = require("./schemas");

connect();

// app.use(morgan("dev"));
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
// app.use(passport.initialize());
// app.use(passport.session());
// webpush.setVapidDetails(
//   "mailto: www.zzzapp.co.kr",
//   process.env.VAPID_PUBLIC_KEY,
//   process.env.VAPID_PRIVATE_KEY
// );

app.get("/", (req, res) => {
  res.send("Welcome to Zzz API server test 9");
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

// 18.117.86.112
// http.createServer(app).listen(port);
// https.createServer(options, app).listen(443);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

module.exports = app;
