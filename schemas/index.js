const mongoose = require('mongoose')

const connect = () => {

  //mongodb://localhost:27017/hanghae4" 
  //mongodb://test:test@13.125.42.68:27017/admin
  // 54.180.109.58
  mongoose.connect('mongodb://test:test@54.180.109.58:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,

  }).catch((err) => console.log((err)))
}

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err)
})


// test 
module.exports = connect