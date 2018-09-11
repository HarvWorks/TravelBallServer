const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

    query = `SELECT HEX(userId2) userId2, email, firstName, lastName, users.createdAt createdAt, users.updatedAt updatedAt
      FROM users LEFT JOIN userRelationship ON userId2 = id WHERE userId1 = UNHEX(?)`
    queryData = [ req.user.id ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => res.status(200).json(data))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
