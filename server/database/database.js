var mongoose = require('mongoose')

var server_uri = process.env.SERVER_URI
if (typeof server_uri == 'undefined') {
  server_uri = 'mongodb://localhost/napchart'
  console.log('SERVER_URI is undefined. using default: ', server_uri)
}

mongoose.connect(server_uri)
mongoose.connection.on('error', console.error.bind(console, 'connection error:'))

var Chart = require('./models/Chart')
var Feedback = require('./models/Feedback')
var User = require('./models/User')

module.exports = {
  connection: mongoose.connection,
  createChart: function (data, callback) {
    var chart = new Chart(data)

    chart.save(function (err, response) {
      callback(err, response)
    })
  },

  getChart: function (chartid, callback) {
    Chart.findOne({
      id: chartid
    }, callback)
  },

  addFeedback: function (f, callback) {
    var feedback = new Feedback({
      feedback: f
    })

    feedback.save(function (err, response) {
      callback(err, response)
    })
  },

  addFeedback: function (f, callback) {
    var feedback = new Feedback({
      feedback: f
    })

    feedback.save(function (err, response) {
      callback(err, response)
    })
  },

  addUser: function (data, callback) {
    var user = new User(data)

    user.save(function (err, response) {
      callback(err, response)
    })
  },

  userExists: function (query, callback) {
    console.log(query)
    User.find(query, function (err, res) {
      if (err) throw err

      if (res.length > 0) {
        callback(null, true)
      } else {
        callback(null, false)
      }
    });
  },

  findUser: function (id, callback) {
    // dont give password field
    User.findById(id, {
      password: 0
    }, callback);
  },

  verifyUser: function (query, password, callback) {
    User.findOne(query, function (err, user) {
      if (err) throw err

      if (user) {
        user.comparePassword(password, function (err, isMatch) {
          if (err) throw err

          if (isMatch) {
            callback(null, user)
          } else {
            callback(null, false)
          }
        })
      } else {
        callback("User does not exist")
      }
    });
  }
}