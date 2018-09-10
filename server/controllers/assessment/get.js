const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  if (!req.param.id)
    return res.status(400).json({ message: "missingFields"  });

  query = `SELECT HEX(assestments.id) id, HEX(assestments.tryoutId) tryoutId, HEX(playerId) playerId,
    hittingMechanics, hittingMechanicsNotes, batSpeed, batSpeedNotes, batContact, batContactNotes,
    throwingMechanics, throwingMechanicsNotes, armStrength, armStrengthNotes, armAccuracy, armAccuracyNotes,
    inField, inFieldNotes, outField, outFieldNotes, baserunMechanics, baserunMechanicsNotes, baserunSpeed,
    baserunSpeedNotes, heart, heartNotes, attitude, attitudeNotes, coachability, coachabilityNotes, createdAt,
    updatedAt FROM assestments LEFT JOIN tryoutCoaches ON assestments.tryoutId = tryoutCoaches.tryoutId
    WHERE userId = UNHEX(?) AND assestments.id = UNHEX(?) LIMIT 1`;

  queryData = [ req.user.id, req.param.id ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => res.status(200).json(data[0]))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
