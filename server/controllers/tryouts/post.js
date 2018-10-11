const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      crypto            = require('crypto');

module.exports = async (req, res) => {
  let query       = ``,
      query2      = ``,
      queryData   = []
      queryData2  = [],
      length      = 0,
      tempPlayers = [],
      tempCoaches = [],
      players     = [],
      coaches     = [];

  if (
    !req.body.teamId ||
    !req.body.name ||
    !req.body.ballParkLocation ||
    !req.body.date ||
    !req.body.players ||
    !req.body.players[0] ||
    !req.body.players[0].value
  )
    return res.status(400).json({ message: "missingFields" });

  const id = crypto.randomBytes(16);

  tempPlayers = req.body.players;
  if ( req.body.players.length > 1 ) {
    length = tempPlayers.length;
    for (let i = 0; i < length; i ++) {
      if (!/^[0-9a-fA-F]{32}$/.test(tempPlayers[i].value)){
        return res.status(400).json({ message: "badUUID" });
      }
      players.push([id, new Buffer(tempPlayers[i].value, 'hex'), "NOW()", "NOW()"])
    }
    query2 = `INSERT INTO assestments (tryoutId, playerId, createdAt, updatedAt) VALUES ?`;
    queryData2 = [players];
  } else {
    query2 = `INSERT INTO assestments SET tryoutId = ?, playerId = UNHEX(?), createdAt = NOW(), updatedAt = NOW()`;
    queryData2 = [id, tempPlayers[0].value];
  }

  if ( req.body.coaches && req.body.coaches[0] && req.body.coaches[0].value ) {
    tempCoaches = req.body.coaches;
    length = tempCoaches.length;
    for (let i = 0; i < length; i ++) {
      if (!/^[0-9a-fA-F]{32}$/.test(tempCoaches[i].value)){
        return res.status(400).json({ message: "badUUID" });
      }
      coaches.push([id, new Buffer(tempCoaches[i].value, 'hex'), false, "NOW()", "NOW()"])
    }
    // Now push the user into the list as a main coach
    coaches.push([id, new Buffer(req.user.id, 'hex'), true, "NOW()", "NOW()"])

    query3 = `INSERT INTO tryoutCoaches (tryoutId, userId, primaryCoach, createdAt, updatedAt) VALUES ?`;
    queryData3 = [coaches];
  } else {
    query3 = `INSERT INTO tryoutCoaches SET tryoutId = ?, userId = UNHEX(?), primaryCoach = ?, createdAt = NOW(),
      updatedAt = NOW()`;
    queryData3 = [id, req.user.id, true];
  }

  query = `INSERT INTO tryouts SET id = ?, teamId = UNHEX(?), userId = UNHEX(?), formulaId = UNHEX(?), name = ?,
    street = ?, city = ?, state = ?, zip = ?, country = ?, date = ?, started = ?, numberPlayers = ?,
    createdAt = NOW(), updatedAt = NOW()`;

  queryData = [
    id,
    req.body.teamId,
    req.user.id,
    req.body.formulaId ? req.body.formulaId : null,
    req.body.name,
    req.body.ballParkLocation,
    req.body.ballParkNotes ? req.body.ballParkNotes : null,
    req.body.street ? req.body.street : null,
    req.body.city ? req.body.city : null,
    req.body.state ? req.body.state : null,
    req.body.zip ? req.body.zip : null,
    req.body.country ? req.body.country : null,
    new Date(req.body.date),
    false,
    tempPlayers.length
  ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(() => Promise.using(getConnection(), connection => connection.query(query2, queryData2)))
    .then(() => Promise.using(getConnection(), connection => connection.query(query3, queryData3)))
    .then(data => res.status(200).json(id.toString('hex')))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
