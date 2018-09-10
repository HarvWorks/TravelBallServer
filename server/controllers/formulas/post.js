const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      crypto            = require('crypto');

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  if (
    !req.body.title ||
    !req.body.hittingMechanics ||
    !req.body.batSpeed ||
    !req.body.batContact ||
    !req.body.throwingMechanics ||
    !req.body.armStrength ||
    !req.body.armAccuracy ||
    !req.body.inField ||
    !req.body.outField ||
    !req.body.baserunSpeed ||
    !req.body.baserunMechanics ||
    !req.body.heart ||
    !req.body.attitude ||
    !req.body.coachability
  )
    return res.status(400).json({ message: "missingFields"  });

  query = `INSERT INTO formulas SET id = UNHEX(?), userId = UNHEX(?), title = ?, hittingMechanics = ?, batSpeed = ?,
    batContact = ?, throwingMechanics = ?, armStrength = ?, armAccuracy = ?, inField = ?, outField = ?,
    baserunSpeed = ?, baserunMechanics = ?, heart = ?, attitude = ?, coachability = ?, createdAt = NOW(),
    updatedAt = NOW()`;

  const id = crypto.randomBytes(16).toString('hex')

  queryData = [
    id,
    req.user.id,
    req.body.title,
    req.body.hittingMechanics,
    req.body.batSpeed,
    req.body.batContact,
    req.body.throwingMechanics,
    req.body.armStrength,
    req.body.armAccuracy,
    req.body.inField,
    req.body.outField,
    req.body.baserunSpeed,
    req.body.baserunMechanics,
    req.body.heart,
    req.body.attitude,
    req.body.coachability
  ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => res.status(200).json(id))
    .catch(error => {
      console.log(error);
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
