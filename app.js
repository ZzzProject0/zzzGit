const express = require("express");
const passportConfig = require("./passport");
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
require("dotenv").config();

const userRouter = require("./routes/user");
const noticeRouter = require("./routes/notice");
const diaryRouter = require("./routes/diary");
const asmrRouter = require("./routes/asmr");
const playlistRouter = require("./routes/playlist");
const authRouter = require("./routes/auth");
const scoresRouter = require("./routes/score");

const connect = require("./schemas");

connect();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello Zzz");
});

// const options = { // letsencrypt로 받은 인증서 경로를 입력
//   ca: fs.readFileSync('/etc/letsencrypt/live/www.zzzback.shop/fullchain.pem'),
//   key: fs.readFileSync('/etc/letsencrypt/live/www.zzzback.shop/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/www.zzzback.shop/cert.pem'),
// };

app.use("/api", express.urlencoded({ extended: false }), userRouter);
app.use("/api", express.urlencoded({ extended: false }), noticeRouter);
app.use("/api", express.urlencoded({ extended: false }), diaryRouter);
app.use("/api/asmr", express.urlencoded({ extended: false }), asmrRouter);
app.use("/api", express.urlencoded({ extended: false }), scoresRouter);
app.use(
  "/api/playlists",
  express.urlencoded({ extended: false }),
  playlistRouter
);
app.use("/auth", express.urlencoded({ extended: false }), authRouter);

// http.createServer(app).listen(port);
// https.createServer(options, app).listen(443);

app.listen(port, () => {
  console.log(`listening at http://18.117.86.112:${port}`);
});
