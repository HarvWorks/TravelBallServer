const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  if (!req.param.id)
    return res.status(400).json({ message: "missingFields"  });

  query = `SELECT HEX(assestments.id) id, HEX(playerId) playerId, HEX(teamId) teamId, firstName, lastName,
    assestments.createdAt, assestments.updatedAt FROM tryoutCoaches LEFT JOIN assestments ON tryoutCoaches.tryoutId =
    assestments.tryoutId LEFT JOIN players ON playerId = players.id WHERE tryoutCoaches.userId = UNHEX(?) AND
    tryoutCoaches.tryoutId = UNHEX(?)`;

  queryData = [ req.user.id, req.param.id ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => res.status(200).json(data[0]))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
