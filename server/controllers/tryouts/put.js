const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      query2      = ``,
      queryData   = []
      queryData2  = [],
      queryAdded  = false;

  if (!req.body.teamId && !req.body.tryoutId)
    return res.status(400).json({ message: "missingFields"  });

  query = `SELECT teamId FROM coaches WHERE userId = UNHEX(?) AND teamId = UNHEX(?) AND coachType > 99 LIMIT 1`;

  queryData = [ req.user.id, req.body.teamId ];

  query2 = `UPDATE teams SET `;

  if (req.body.name) {
    query2 += `name = ? `;
    queryData2.push(req.body.name)
    queryAdded = true;
  }

  if (req.body.street) {
    if (queryAdded)
      query2 += `, `
    query2 += `street = ? `;
    queryData2.push(req.body.street)
    queryAdded = true;
  }

  if (req.body.city) {
    if (queryAdded)
      query2 += `, `
    query2 += `city = ? `;
    queryData2.push(req.body.city)
    queryAdded = true;
  }

  if (req.body.state) {
    if (queryAdded)
      query2 += `, `
    query2 += `state = ? `;
    queryData2.push(req.body.state)
    queryAdded = true;
  }

  if (req.body.zip) {
    if (queryAdded)
      query2 += `, `
    query2 += `zip = ? `;
    queryData2.push(req.body.zip)
    queryAdded = true;
  }

  if (req.body.country) {
    if (queryAdded)
      query2 += `, `
    query2 += `country = ? `;
    queryData2.push(req.body.country)
    queryAdded = true;
  }

  if (!queryAdded)
    return res.status(200).json({ message: "emptyFields" });

  query2 += `, updatedAt = NOW() WHERE id = (SELECT teamId FROM coaches WHERE userId = UNHEX(?) AND teamId = UNHEX(?) AND
    coachType > 99 LIMIT 1) LIMIT 1`;

  queryData2.push(req.user.id);
  queryData2.push(req.body.tryoutId);

  Promise.using(getConnection(), connection => connection.execute(userQuery, userData))
    .spread(data => {
      if (!data[0] || !data[0].teamId)
        throw { status: 400, message: "notHeadCoach" };
      return Promise.using(getConnection(), connection => connection.execute(query2, queryData2))
    })
    .then(data => res.end())
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
