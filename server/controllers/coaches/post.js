const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      crypto            = require('crypto');

module.exports = async (req, res) => {
  let query       = ``,
      query2      = ``,
      queryData   = [],
      queryData2  = [];

  if (!req.body.userId || !req.body.teamId)
    return res.status(400).json({ message: "missingFields"  });

  query = `SELECT teamId FROM coaches WHERE userId = UNHEX(?) AND teamId = UNHEX(?) AND coachType > 99`;

  query2 = `INSERT INTO coaches SET userId = UNHEX(?), teamId = UNHEX(?), coachType = 1, createdAt = NOW(), updatedAt = NOW()`;

  queryData = [ req.user.id, req.body.teamId ];

  queryData2 = [ req.body.userId, req.body.teamId ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .spread(data => {
      if (!data[0] || !data[0].teamId)
        throw { status: 400, message: "notHeadCoach" };
      return Promise.using(getConnection(), connection => connection.execute(query2, queryData2))
    })
    .then(data => res.status(200).json(data[0]))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
