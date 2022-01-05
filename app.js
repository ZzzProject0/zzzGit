const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
const port = 3000
const path = require('path')
require("dotenv").config();
const jwt = require('jsonwebtoken')
const authMiddlewares = require('./middlewares/auth-middleware')

const userRouter = require('./routes/user')
const noticeRouter = require('./routes/notice')
const diaryRouter = require('./routes/diary')
const asmrRouter = require('./routes/asmr')
const scoresRouter = require('./routes/score')

const connect = require('./schemas')
connect()

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())

app.get("/", (req, res) => {
  res.send("hello zzz")
})
app.use('/api', express.urlencoded({ extended: false }), userRouter)
app.use('/api', express.urlencoded({ extended: false }), noticeRouter)
app.use('/api', express.urlencoded({ extended: false }), diaryRouter)
app.use('/api/asmr', express.urlencoded({ extended: false }), asmrRouter)
app.use('/api', express.urlencoded({ extended: false }), scoresRouter)

app.listen(port, () => {
  console.log(`listening at http://18.117.86.112:${port}`)
})