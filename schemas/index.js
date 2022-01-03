const mongoose = require('mongoose')

const connect = () => {
  //production : mongodb://test:test@54.180.109.58:27017
  //dev : mongodb://localhost/hanghae4
  mongoose.connect('mongodb://localhost/hanghae4', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => console.log((err)))
}

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err)
})


// test 
module.exports = connect