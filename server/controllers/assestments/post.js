const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      crypto            = require('crypto');

module.exports = async (req, res) => {
  let query       = ``,
      query2      = ``,
      queryData   = []
      queryData2  = [];

  if (!req.body.teamId && !req.body.playerId)
    return res.status(400).json({ message: "missingFields"  });

  query = `SELECT userId FROM coaches INNER JOIN players ON coaches.teamId = players.teamId WHERE userId = UNHEX(?) AND
    coaches.teamId = UNHEX(?) AND players.id = UNHEX(?)`

  queryData = [ req.user.id, req.body.teamId, req.body.playerId ];

  query2 = `INSERT INTO assestments SET id = UNHEX(?), playerId = UNHEX(?), userId = UNHEX(?), teamId = UNHEX(?),
    hittingMechanics = ?, hittingMechanicsNotes = ?, batSpeed = ?, batSpeedNotes = ?, batContact = ?, batContactNotes =?,
    throwingMechanics = ?, throwingMechanicsNotes = ?, armStrength = ?, armStrengthNotes = ?, armAccuracy = ?,
    armAccuracyNotes = ?, inField = ?, inFieldNotes = ?, outField = ?, outFieldNotes = ?, baserunMechanics = ?,
    baserunMechanicsNotes = ?, baserunSpeed = ?, baserunSpeedNotes = ?, heart = ?, heartNotes = ?, attitude = ?,
    attitudeNotes = ?, coachability = ?, coachabilityNotes = ?, createdAt = NOW(), updatedAt = NOW()`;

  const id = crypto.randomBytes(16).toString('hex')

  queryData2 = [
    id,
    req.body.playerId,
    req.user.id,
    req.body.teamId,
    req.body.hittingMechanics ? req.body.hittingMechanics : null,
    req.body.hittingMechanicsNotes ? req.body.hittingMechanicsNotes : null,
    req.body.batSpeed ? req.body.batSpeed : null,
    req.body.batSpeedNotes ? req.body.batSpeedNotes : null,
    req.body.batContact ? req.body.batContact : null,
    req.body.batContactNotes ? req.body.batContactNotes : null,
    req.body.throwingMechanics ? req.body.throwingMechanics : null,
    req.body.throwingMechanicsNotes ? req.body.throwingMechanicsNotes : null,
    req.body.armStrength ? req.body.armStrength : null,
    req.body.armStrengthNotes ? req.body.armStrengthNotes : null,
    req.body.armAccuracy ? req.body.armAccuracy : null,
    req.body.armAccuracyNotes ? req.body.armAccuracyNotes : null,
    req.body.inField ? req.body.inField : null,
    req.body.inFieldNotes ? req.body.inFieldNotes : null,
    req.body.outField ? req.body.outField : null,
    req.body.outFieldNotes ? req.body.outFieldNotes : null,
    req.body.baserunSpeed ? req.body.baserunSpeed : null,
    req.body.baserunSpeedNotes ? req.body.baserunSpeedNotes : null,
    req.body.baserunMechanics ? req.body.baserunMechanics : null,
    req.body.baserunMechanicsNotes ? req.body.baserunMechanicsNotes : null,
    req.body.heart ? req.body.heart : null,
    req.body.heartNotes ? req.body.heartNotes : null,
    req.body.attitude ? req.body.attitude : null,
    req.body.attitudeNotes ? req.body.attitudeNotes : null,
    req.body.coachability ? req.body.coachability : null,
    req.body.coachabilityNotes ? req.body.coachabilityNotes : null,
  ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .spread(data => {
      if (!data[0] || !data[0].userId)
  			throw { status: 400, message: "notPartOfTeam" };
      return Promise.using(getConnection(), connection => connection.execute(query2, queryData2))
    })
    .then(data => res.status(200).json(id))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
