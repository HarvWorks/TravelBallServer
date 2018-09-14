const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      crypto            = require('crypto');

module.exports = async (req, res) => {
  let query       = ``,
      query2      = ``,
      query3      = ``,
      query4      = ``,
      queryData   = []
      queryData2  = [],
      queryData3  = [],
      queryData4  = [],
      length      = 0,
      tryoutId    = '',
      tempPlayers = [],
      players     = [],
      playerIds   = [];

  if (!req.body.id || !req.body.players || !req.body.players[0] || !req.body.players[0].value)
    return res.status(400).json({ message: "missingFields" });

  query = `SELECT tryoutId FROM tryoutCoaches WHERE tryoutId = UNHEX(?) AND userId = UNHEX(?)`;
  queryData = [ req.body.id, req.user.id ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .spread(data => {
      if (!data[0] && !data[0].tryoutId)
        throw {status: 400, message: 'Looks like you are not part of this team.'}
      tryoutId = data[0].tryoutId;

      // Now add the queries to both delete the extra players and add in the new ones
      tempPlayers = req.body.players;
      if ( req.body.players.length > 1 ) {
        length = tempPlayers.length;
        for (let i = 0; i < length; i ++) {
          if (!/^[0-9a-fA-F]{32}$/.test(tempPlayers[i].value)){
            throw { status: 400, message: "badUUID" };
          }
          playerIds.push(new Buffer(tempPlayers[i].value, 'hex'))
          players.push([tryoutId, new Buffer(tempPlayers[i].value, 'hex'), "NOW()", "NOW()"])
        }
        query2 = `DELETE FROM assestments WHERE tryoutId = ? AND playerId NOT IN (?)`;
        queryData2 = [tryoutId, playerIds];
        query3 = `INSERT IGNORE INTO assestments (tryoutId, playerId, createdAt, updatedAt) VALUES ?`;
        queryData3 = [players];
      } else {
        query2 = `DELETE FROM assestments WHERE tryoutId = ? AND playerId NOT IN (?)`;
        queryData2 = [tryoutId, tempPlayers[0].value];
        query3 = `INSERT IGNORE INTO assestments SET tryoutId = ?, playerId = UNHEX(?), createdAt = NOW(), updatedAt = NOW()`;
        queryData3 = [tryoutId, tempPlayers[0].value];
      }
      // Also set up the query for counting the number of players
      query4 = `UPDATE tryouts SET numberPlayers = ? WHERE id = ?`;
      queryData4  = [ players.length, tryoutId ];

      return Promise.using(getConnection(), connection => connection.query(query2, queryData2))
    })
    .then(() => Promise.using(getConnection(), connection => connection.query(query3, queryData3)))
    .then(() => Promise.using(getConnection(), connection => connection.execute(query4, queryData4)))
    .then(data => res.status(200).json())
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
