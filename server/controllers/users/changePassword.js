const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      crypto            = require('crypto'),
      jwt               = require("jsonwebtoken"),
      Bcrypt            = Promise.promisifyAll(require("bcrypt")),
      serverKeys        = require("../../../keys/keys");

module.exports = async (req, res) => {
  let query       = ``,
      query2      = ``;

  if ( !req.body.newPassword && !req.body.oldPassword )
    return res.status(400).json({ message: "missingFields"  });

  query = `SELECT password FROM users WHERE id = UNHEX(?)`

  query2 = `UPDATE users SET password = ? WHERE id = UNHEX(?)`

  Promise.using(getConnection(), connection => connection.execute(query, [ req.user.id ]))
    .spread(data => Bcrypt.compareAsync(req.body.oldPassword, data[0].password))
    .then(isMatch => {
      if (!isMatch)
  			throw { status: 400, message: "Incorrect Password" };
      return Bcrypt.hashAsync(req.body.newPassword, 10);
    })
    .then(hash => Promise.using(getConnection(), connection => {
      return connection.execute(query2, [ hash, req.user.id ])
    }))
    .then(() => res.end())
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
