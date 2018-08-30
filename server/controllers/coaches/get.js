const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  if (req.body.teamId) {
    query = `SELECT HEX(userId) userId, HEX(teamId) teamId, coachType, email, firstName, lastName,
      coaches.createdAt createdAt, coaches.updatedAt updatedAt FROM coaches LEFT JOIN users ON userId = users.id
      WHERE teamId = (SELECT teamId FROM coaches WHERE userId = UNHEX(?) AND teamId = UNHEX(?) LIMIT 1)`
    queryData = [ req.user.id, req.body.teamId ];
  } else {
    query = `SELECT HEX(userId) userId, HEX(teamId) teamId, coachType, name, coaches.createdAt createdAt,
      coaches.updatedAt updatedAt FROM coaches LEFT JOIN teams ON teamId = teams.id WHERE userId = UNHEX(?)`
    queryData = [ req.user.id ];
  }

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => res.status(200).json(data[0]))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
