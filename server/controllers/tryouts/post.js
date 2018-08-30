const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      crypto            = require('crypto');

module.exports = async (req, res) => {
  let query       = ``,
      query2      = ``,
      queryData   = []
      queryData2  = [];

  if (
    !req.body.teamId &&
    !req.body.name &&
    !req.body.street &&
    !req.body.city &&
    !req.body.state &&
    !req.body.zip &&
    !req.body.country
  )
    return res.status(400).json({ message: "missingFields"  });

  query = `SELECT teamId FROM coaches WHERE userId = UNHEX(?) AND teamId = UNHEX(?) AND coachType > 99 LIMIT 1`;

  query2 = `INSERT INTO tryouts SET id = UNHEX(?), teamId = UNHEX(?), name = ?, street = ?, city = ?, state = ?, zip = ?,
    country = ?, createdAt = NOW(), updatedAt = NOW()`;

  const id = crypto.randomBytes(16).toString('hex');

  queryData = [ req.user.id, req.body.teamId ];

  queryData2 = [
    id,
    req.body.teamId,
    req.body.name,
    req.body.street
    req.body.city
    req.body.state
    req.body.zip
    req.body.country
  ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .spread(data => {
      if (!data[0] || !data[0].teamId)
        throw { status: 400, message: "notHeadCoach" };
      return Promise.using(getConnection(), connection => connection.execute(query2, queryData2))
    })
    .then(data => res.status(200).json(id))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
