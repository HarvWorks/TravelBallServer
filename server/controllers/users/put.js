const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      nodeMailer        = require('../../config/nodemailer');

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [],
      queryAdded  = false;

  query = `UPDATE users SET `;

  if (req.body.email) {
    // Validate email:
    if (!/@/.test(req.body.email))
      return res.status(400).json({ message: "emailErr" });

    query += `newEmail = ? `;
    queryData.push(req.body.email)
    queryAdded = true;
    try {
      nodeMailer.mailOptions.to = req.body.email;
      nodeMailer.mailOptions.subject = "Please verify this new email";
      nodeMailer.mailOptions.html = await nodeMailer.newEmailVerfication(req.body);
      await nodeMailer.transporter.sendMail(nodeMailer.mailOptions);
    } catch (error) {
      return res.status(400).json({ message: "admin", error: error });
    }
  }

  if (req.body.birthday) {
    if (queryAdded)
      query += `, `
    query += `birthday = ? `;
    queryData.push(req.body.birthday)
    queryAdded = true;
  }

  if (req.body.gender) {
    if (queryAdded)
      query += `, `
    query += `gender = ? `;
    queryData.push(req.body.gender)
    queryAdded = true;
  }

  if (req.body.firstName) {
    if (queryAdded)
      query += `, `
    query += `firstName = ? `;
    queryData.push(req.body.firstName)
    queryAdded = true;
  }

  if (req.body.lastName) {
    if (queryAdded)
      query += `, `
    query += `lastName = ? `;
    queryData.push(req.body.lastName)
    queryAdded = true;
  }

  if (req.body.city) {
    if (queryAdded)
      query += `, `
    query += `city = ? `;
    queryData.push(req.body.city)
    queryAdded = true;
  }

  if (req.body.state) {
    if (queryAdded)
      query += `, `
    query += `state = ? `;
    queryData.push(req.body.state)
    queryAdded = true;
  }

  if (req.body.zip) {
    if (queryAdded)
      query += `, `
    query += `zip = ? `;
    queryData.push(req.body.zip)
    queryAdded = true;
  }

  if (req.body.phoneNumber) {
    if (queryAdded)
      query += `, `
    query += `phoneNumber = ? `;
    queryData.push(req.body.phoneNumber)
    queryAdded = true;
  }

  if (!queryAdded)
    return res.status(200).json({ message: "emptyFields" });

  query += `, updatedAt = NOW() WHERE id = UNHEX(?)`;
  queryData.push(req.user.id);

  console.log(req.user.id);
  console.log(query);

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => res.end())
    .catch(error => {
      console.log(error);
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
