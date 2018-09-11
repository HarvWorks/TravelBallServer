const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      query2      = ``,
      query3      = ``,
      queryData   = [],
      queryData2  = [],
      queryData3  = [],
      results     = {};

  query = `SELECT HEX(id) id, HEX(teamId) teamId, name, street, city, state, zip, country, tryouts.createdAt
    createdAt, tryouts.updatedAt updatedAt FROM tryouts LEFT JOIN tryoutCoaches on id = tryoutId
    WHERE tryoutCoaches.userId = UNHEX(?)`;

  queryData = [ req.user.id ];

  query2 = `SELECT HEX(id) id, a.primary, firstName, lastName, email, users.createdAt createdAt,
    users.updatedAt updatedAt FROM users LEFT JOIN tryoutCoaches a ON a.userId = id LEFT JOIN tryoutCoaches b
    ON a.tryoutId = b.tryoutId WHERE b.tryoutId = UNHEX(?) AND b.userId = UNHEX(?)`

  queryData2 = [ req.params.id, req.user.id ];

  query3 = `SELECT HEX(assestments.id) id, HEX(playerId) playerId, HEX(teamId) teamId, firstName, lastName,
    assestments.createdAt, assestments.updatedAt FROM tryoutCoaches LEFT JOIN assestments ON tryoutCoaches.tryoutId =
    assestments.tryoutId LEFT JOIN players ON playerId = players.id WHERE tryoutCoaches.userId = UNHEX(?) AND
    tryoutCoaches.tryoutId = UNHEX(?)`;

  queryData3 = [ req.user.id, req.params.id ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => {
      results = data[0];
      return Promise.using(getConnection(), connection => connection.execute(query2, queryData2));
    })
    .then(data => {
      results.coaches = data;
      return Promise.using(getConnection(), connection => connection.execute(query3, queryData3));
    })
    .then(data => {
      results.players = data;
      return res.status(200).json(results);
    })

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => res.status(200).json(data[0]))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
