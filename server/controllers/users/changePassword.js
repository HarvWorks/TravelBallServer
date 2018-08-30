const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      crypto            = require('crypto'),
      jwt               = require("jsonwebtoken"),
      Bcrypt            = Promise.promisifyAll(require("bcrypt")),
      serverKeys        = require("../../../keys/keys");

module.exports = async (req, res) => {
  let query       = ``;

  query = `UPDATE users SET password = ? WHERE id = UNHEX(?)`

  Bcrypt.hashAsync(req.body.password, 10)
    .then(hash => Promise.using(getConnection(), connection => {
      return connection.execute(query, [ hash, req.user.id ])
    }))
    .then(() => {
      // Create a new jwt token for the user
      const tsbToken = jwt.sign({
        id: id,
        exp: Math.floor(Date.now() / 1000) + 24 * 3600 * 1000
      }, serverKeys.jwtKey);
      res.status(200).json(tsbToken);
    })
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
