const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      crypto            = require('crypto'),
      jwt               = require("jsonwebtoken"),
      Bcrypt            = Promise.promisifyAll(require("bcrypt")),
      serverKeys        = require("../../../keys/keys");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  // Expected form data. Check if the data has been passed to the server (as a JSON object) and if not return
	if (!req.body.email || !req.body.password)
    return res.status(400).json({ message: "missingFields" });

  // Validate email:
	if (!/@/.test(req.body.email))
    return res.status(400).json({ message: "invalidEmail." });

  // Validate password:
	if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&](?=.{7,})/.test(req.body.password))
		return res.status(400).json({ message: "badPassword" });

  const id = crypto.randomBytes(16).toString('hex')

  query = `INSERT INTO users SET id = UNHEX(?), email = ?, password = ?, verified = 0, createdAt = NOW(), updatedAt = NOW()`;

  queryData = [
    id,
    req.body.email
  ];

  Bcrypt.hashAsync(req.body.password, 10)
    .then(hash => Promise.using(getConnection(), connection => {
      // Add the password to the query after the password has been hashed
      queryData.push(hash)
      return connection.execute(query, queryData)
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
