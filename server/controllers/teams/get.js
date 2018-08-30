const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  query = `SELECT email, birthday, gender, firstName, lastName, city, state, zip, phoneNumber, createdAt, updatedAt
    FROM users WHERE id = UNHEX(?)`

  queryData = [ req.user.id ];

  Promise.using(getConnection(), connection => connection.execute(userQuery, userData))
    .then(data => res.status(200).json(data[0]))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
