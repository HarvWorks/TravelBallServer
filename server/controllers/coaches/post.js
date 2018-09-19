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
      coach       = [],
      password    = '',
      id          = '';

  if (!req.body.email)
    return res.status(400).json({ message: "missingFields" });

  // Validate email:
	if (!/@/.test(req.body.email))
    return res.status(400).json({ message: "invalidEmail." });

  query = `SELECT HEX(id) id, verified FROM users WHERE email = ?`;

  query2 = `INSERT IGNORE INTO userRelationship (userId1, userId2, createdAt, updatedAt) VALUES ?`;

  queryData = [ req.body.email ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .spread(data => {
      coach = data;
      if (!coach[0] || !coach[0].id) {
        query = `SELECT email from users WHERE id = UNHEX(?)`;
        queryData = [ req.user.id ];
        return Promise.using(getConnection(), connection => connection.execute(query, queryData))
      }
      return [];
    })
    .spread(inviterEmail => {
      if (!coach[0] || !coach[0].id) {
        id = crypto.randomBytes(16);
        password = generator.generate({
          length: 10,
          numbers: true
        });
        const dataPackage = {
          password: password,
          inviterEmail: inviterEmail[0].email,
          email: req.body.email
        }
        const emailPackage = nodeMailer.inviteCoaches(dataPackage);
        nodeMailer.mailOptions.to = req.body.email;
        nodeMailer.mailOptions.subject = emailPackage.subject;
        nodeMailer.mailOptions.html = emailPackage.html;
        return nodeMailer.transporter.sendMail(nodeMailer.mailOptions)
      }
    })
    .then(() => {
      if (!coach[0] || !coach[0].id) {
        return Bcrypt.hashAsync(password, 10);
      }
    })
    .then(hash => {
      if (!coach[0] || !coach[0].id) {
        query = `INSERT INTO users SET id = ?, email = ?, password = ?, verified = -1, createdAt = NOW(), updatedAt = NOW()`;
        queryData = [ id, req.body.email, hash ];
        return Promise.using(getConnection(), connection => connection.execute(query, queryData))
      } else {
        id = coach[0].id
      }
    })
    .then(() => {
      queryData2 = [
        [ new Buffer(req.user.id, 'hex'), new Buffer(id, 'hex'), "NOW()", "NOW()" ],
        [ new Buffer(id, 'hex'), new Buffer(req.user.id, 'hex'), "NOW()", "NOW()" ]
      ];
      return Promise.using(getConnection(), connection => connection.query(query2, [queryData2]));
    })
    .then(() => res.status(200).json(id.toString('hex')))
    .catch((error) => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    })
}
