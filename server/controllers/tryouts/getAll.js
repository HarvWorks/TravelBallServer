const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  query = `SELECT HEX(id) id, HEX(teamId) teamId, name, street, city, state, zip, country, date, tryouts.createdAt createdAt,
    tryouts.updatedAt updatedAt FROM tryouts LEFT JOIN tryoutCoaches on id = tryoutId
    WHERE tryouts.userId = UNHEX(?)`;

  queryData = [ req.user.id ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .spread(data => res.status(200).json(data))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
