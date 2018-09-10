const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      query2      = ``,
      queryData   = [],
      queryData2  = [],
      results     = [];

  if (!req.params.id)
    return res.status(400).json({ message: "missingFields"  });

  query = `SELECT HEX(players.id) id, HEX(players.teamId) teamId, firstName, lastName, teamNumber, birthday, position,
    throwingArm, battingArm, phoneNumber, email, parentFirstName, parentLastName, players.createdAt createdAt,
    players.updatedAt updatedAt FROM players LEFT JOIN userTeams ON players.teamId = userTeams.teamId WHERE
    userId = UNHEX(?) AND players.id = UNHEX(?) LIMIT 1`;

  query2 = `SELECT HEX(assestments.id) id, HEX(teamId) teamId, HEX(tryoutCoaches.tryoutId) tryoutId, name, street, city,
    state, zip, country, date, tryouts.createdAt createdAt, tryouts.updatedAt updatedAt FROM assestments LEFT JOIN
    tryouts ON assestments.tryoutId = tryouts.id LEFT JOIN tryoutCoaches ON tryouts.id = tryoutCoaches.tryoutId WHERE
    userId = UNHEX(?) AND assestments.playerId = UNHEX(?)`;

  queryData = [ req.user.id, req.params.id ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .spread(data => {
      console.log('first query', data);
      results = data;
      return Promise.using(getConnection(), connection => connection.execute(query2, queryData))
    })
    .spread(data => {
      console.log('second query', results);
      if (results[0] && results[0].id) {
        results[0].assessment = data
      }
      return res.status(200).json(results[0])
    })
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
