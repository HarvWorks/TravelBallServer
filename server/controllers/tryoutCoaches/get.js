const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

    query = `SELECT HEX(id) id, a.primary, firstName, lastName, email, users.createdAt createdAt,
      users.updatedAt updatedAt FROM users LEFT JOIN tryoutCoaches a ON a.userId = id LEFT JOIN tryoutCoaches b
      ON a.tryoutId = b.tryoutId WHERE b.tryoutId = UNHEX(?) AND b.userId = UNHEX(?)`
    queryData = [ req.params.id, req.user.id ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => res.status(200).json(data))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
