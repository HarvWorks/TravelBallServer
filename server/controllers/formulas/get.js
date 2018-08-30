const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  if (!req.body.formulaId)
    return res.status(400).json({ message: "missingFields"  });

  query = `SELECT HEX(id) id, title, hittingMechanics, batSpeed, batContact, throwingMechanics, armStrength,
    armAccuracy, inField, outField, baserunMechanics, baserunSpeed, heart, attitude, coachability, createdAt,
    updatedAt FROM formulas WHERE userId = UNHEX(?) AND id = UNHEX(?)`;

  queryData = [ req.user.id, req.body.formulaId ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => res.status(200).json(data[0]))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
