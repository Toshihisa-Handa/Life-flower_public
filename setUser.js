var connection = require('./mysqlConnection');

module.exports = function(req, res, next) {
  var userId = req.session.user_id;
  if (userId) {
    var query = 'SELECT user_id, name FROM user WHERE user_id = ' + userId;
    connection.query(query, function(err, rows) {
      if (!err) {
        res.locals.user = rows.length? rows[0]: false;
      }
    });
  }
  next();
};