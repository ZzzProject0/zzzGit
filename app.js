const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const http = require('http');
const https = require('https');

const port = 3000;
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const authMiddlewares = require('./middlewares/auth-middleware');

const userRouter = require('./routes/user');
const noticeRouter = require('./routes/notice');
const diaryRouter = require('./routes/diary');
const asmrRouter = require('./routes/asmr');
const playlistRouter = require('./routes/playlist');

const scoresRouter = require('./routes/score');

const connect = require('./schemas');

connect();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello zzz');
});

// const options = { // letsencrypt로 받은 인증서 경로를 입력
//   ca: fs.readFileSync('/etc/letsencrypt/live/www.zzzback.shop/fullchain.pem'),
//   key: fs.readFileSync('/etc/letsencrypt/live/www.zzzback.shop/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/www.zzzback.shop/cert.pem'),
// };

app.use('/api', express.urlencoded({ extended: false }), userRouter);
app.use('/api', express.urlencoded({ extended: false }), noticeRouter);
app.use('/api', express.urlencoded({ extended: false }), diaryRouter);
app.use('/api/asmrTracks', express.urlencoded({ extended: false }), asmrRouter);
app.use('/api', express.urlencoded({ extended: false }), scoresRouter);
app.use('/api/playlists', express.urlencoded({ extended: false }), playlistRouter);

// http.createServer(app).listen(port);
// https.createServer(options, app).listen(443);

app.listen(port, () => {
  console.log(`listening at http://18.117.86.112:${port}`);
});
