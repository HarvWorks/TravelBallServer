const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  query = `SELECT HEX(id) id, name, street, city, state, zip, country, createdAt, updatedAt FROM teams
    WHERE userId = UNHEX(?)`

  queryData = [ req.user.id ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => res.status(200).json(data[0]))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
