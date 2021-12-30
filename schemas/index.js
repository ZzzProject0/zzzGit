const mongoose = require('mongoose')

const connect = () => {
  mongoose.connect('mongodb://test:test@13.125.42.68:27017/admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ignoreUndefined: true,
  }).catch((err) => console.log((err)))
}

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err)
})


// test 
module.exports = connect