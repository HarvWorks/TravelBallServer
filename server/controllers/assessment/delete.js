const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  if (!req.query.playerId || !req.query.tryoutId)
    return res.status(400).json({ message: "missingFields"  });

  query = `DELETE FROM assestments WHERE tryoutId = ? AND playerId = ?`

  queryData = [ req.query.tryoutId, req.user.id, req.query.playerId ];

  query2 = `UPDATE tryouts SET numberPlayers = numberPlayers - 1 WHERE tryoutId = UNHEX(?)`;

  queryData2  = [ req.body.tryoutId ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(() => Promise.using(getConnection(), connection => connection.execute(query2, queryData2)))
    .then(data => res.end())
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
