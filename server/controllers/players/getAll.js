const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  query = `SELECT HEX(players.id) id, HEX(players.teamId) teamId, firstName, lastName, teamNumber, birthday, position,
    throwingArm, battingArm, phoneNumber, email, parentFirstName, parentLastName, players.createdAt createdAt,
    players.updatedAt updatedAt FROM players LEFT JOIN userTeams ON players.teamId = userTeams.teamId WHERE
    userId = UNHEX(?)`;

  queryData = [ req.user.id ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => res.status(200).json(data[0]))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
