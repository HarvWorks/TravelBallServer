const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      crypto            = require('crypto'),
      jwt               = require("jsonwebtoken"),
      Bcrypt            = Promise.promisifyAll(require("bcrypt")),
      serverKeys        = require("../../../keys/keys");

module.exports = async (req, res) => {
  let query       = ``,
      query2      = ``,
      queryData   = [];

  // Expected login data
	if (!req.body.email || !req.body.password)
    return res.status(400).json({ message: "missingFields"  });

  // Validate email:
  if (!/@/.test(req.body.email))
    return res.status(400).json({ message: "loginErr" });

  // Pre-validate password:
	if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&](?=.{7,})/.test(req.body.password))
		return res.status(400).json({ message: "passwordErr" });

  query = `SELECT password FROM users WHERE email = ? LIMIT 1`;
  query2 = `SELECT email, newEmail, birthday, gender, firstName, lastName, city, state, zip, phoneNumber, createdAt, updatedAt
    FROM users WHERE email = ? LIMIT 1`;
  // query2 = `SELECT HEX(user.id), email, newEmail, birthday, gender, firstName, lastName, user.createdAt, user.updatedAt,
  //   HEX(teamId), coachType, coach.createdAt, coach.updatedAt, name FROM users user LEFT JOIN coaches coach ON
  //   user.id = userId LEFT JOIN teams ON teamId = teams.id WHERE email = ? LIMIT 1`;

  queryData = [ req.body.email ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .spread(data => Bcrypt.compareAsync(req.body.password, data[0].password))
    .then(isMatch => {
      if (!isMatch)
  			throw { status: 400, message: "loginErr" };
      return Promise.using(getConnection(), connection => connection.execute(query2, queryData))
    })
    .spread(data => res.status(200).json(data[0]))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
