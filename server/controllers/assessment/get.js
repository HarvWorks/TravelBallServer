const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  if (!req.params.id)
    return res.status(400).json({ message: "missingFields" });
    console.log(req.params.id);

  const idArray = req.params.id.split("+");

  if (idArray.length !== 2)
    return res.status(400).json({ message: "missingFields" });

  console.log(idArray);

  query = `SELECT HEX(assestments.tryoutId) tryoutId, HEX(playerId) playerId, hittingMechanics, hittingMechanicsNotes,
    batSpeed, batSpeedNotes, batContact, batContactNotes, throwingMechanics, throwingMechanicsNotes, armStrength,
    armStrengthNotes, armAccuracy, armAccuracyNotes, inField, inFieldNotes, outField, outFieldNotes, baserunMechanics,
    baserunMechanicsNotes, baserunSpeed, baserunSpeedNotes, heart, heartNotes, attitude, attitudeNotes, coachability,
    coachabilityNotes, assestments.createdAt, assestments.updatedAt FROM assestments LEFT JOIN tryoutCoaches ON
    assestments.tryoutId = tryoutCoaches.tryoutId WHERE userId = UNHEX(?) AND assestments.playerId = UNHEX(?) AND
    assestments.tryoutId = UNHEX(?)LIMIT 1`;

  queryData = [ req.user.id, idArray[0], idArray[1] ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .spread(data => {
      console.log(data);
      return res.status(200).json(data[0])
    })
    .catch(error => {
      console.log(error);
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
