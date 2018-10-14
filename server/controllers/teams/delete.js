const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  if (!req.query.teamId)
    return res.status(400).json({ message: "missingFields"  });

  query = `DELETE FROM teams WHERE id = (SELECT teamId FROM coaches WHERE userId = UNHEX(?) AND teamId = UNHEX(?) AND
    coachType > 99 LIMIT 1) LIMIT 1`

  queryData = [ req.user.id, req.query.teamId ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => res.end())
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
