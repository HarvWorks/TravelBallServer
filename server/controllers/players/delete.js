const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  if (!req.body.playerId)
    return res.status(400).json({ message: "missingFields"  });


  query = `DELETE FROM players WHERE teamId = (SELECT teamId FROM coaches WHERE userId = UNHEX(?) LIMIT 1) AND
    id = UNHEX(?) LIMIT 1`

  queryData = [
    req.user.id,
    req.body.playerId
  ];

  Promise.using(getConnection(), connection => connection.execute(userQuery, userData))
    .then(data => res.end())
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
