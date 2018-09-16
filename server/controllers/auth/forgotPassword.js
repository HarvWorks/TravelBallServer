const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      Bcrypt            = Promise.promisifyAll(require("bcrypt")),
      nodeMailer        = require('../../config/nodemailer'),
      serverKeys        = require("../../../keys/keys"),
      generator         = require('generate-password'),
      crypto            = require('crypto');

module.exports = (req, res) => {
  let query       = ``,
      query2      = ``,
      queryData   = [],
      queryData2  = [],
      password    = '',
      id          = '';

  // Requires email
  if (!req.body.email)
    return res.status(400).json({ message: "missingFields" });

  // Pre validate email:
	if (!/@/.test(req.body.email))
    return res.status(400).json({ message: "invalidEmail." });

  // Grab the user, make sure they exist and grab their id and their names just if they have it.
  query = `SELECT HEX(id) id, firstName, lastName, verified FROM users WHERE email = ?`;

  queryData = [ req.body.email ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .spread(data => {
      // End early if the person does not exist
      if (data.length === 0)
        throw {status: 200, message: ""};
      // Generate a random password
      id = data[0].id
      password = generator.generate({
        length: 10,
        numbers: true
      });
      return Bcrypt.hashAsync(password, 10);
    })
    .then(hash => {
      query2 = `UPDATE users SET password = ? WHERE id = UNHEX(?) LIMIT 1`;
      queryData2 = [ hash, id]
      return Promise.using(getConnection(), connection => connection.execute(query2, queryData2))
    })
    .then(() => {
      const dataPackage = {
        password: password
      }
      const emailPackage = nodeMailer.resetPassword(dataPackage);
      nodeMailer.mailOptions.to = req.body.email;
      nodeMailer.mailOptions.subject = emailPackage.subject;
      nodeMailer.mailOptions.html = emailPackage.html;
      return nodeMailer.transporter.sendMail(nodeMailer.mailOptions)
    })
    .then(() => res.end())
    .catch((error) => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    })
}
