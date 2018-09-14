const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  query = `SELECT HEX(id) id, HEX(teamId) teamId, HEX(formulaId) formulaId, HEX(tryouts.userId) ownerId, name, street,
    city, state, zip, numberPlayers, numberCoaches, country, date, tryouts.createdAt createdAt, tryouts.updatedAt
    updatedAt FROM tryoutCoaches LEFT JOIN tryouts on id = tryoutId WHERE tryoutCoaches.userId = UNHEX(?)`;

  queryData = [ req.user.id ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .spread(data => res.status(200).json(data))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
