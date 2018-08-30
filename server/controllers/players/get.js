const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  if (!req.body.teamId)
    return res.status(400).json({ message: "missingFields"  });

  query = `SELECT HEX(players.id) id, firstName, lastName, teamNumber, birthday, position, throwingArm, battingArm,
    phoneNumber, email, parentFirstName, parentLastName, createdAt, updatedAt FROM players LEFT JOIN coaches ON
    players.teamId = coaches.teamId WHERE userId = UNHEX(?) AND teamId = UNHEX(?)`;

  queryData = [
    req.user.id,
    req.body.teamId
  ];

  Promise.using(getConnection(), connection => connection.execute(userQuery, userData))
    .then(data => res.status(200).json(data[0]))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
