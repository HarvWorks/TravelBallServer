const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [],
      queryAdded  = false;

  if (!req.body.formulaId)
    return res.status(400).json({ message: "missingFields"  });

  query = `UPDATE assestments SET `;

  if (req.body.title) {
    query += `title = ? `;
    queryData.push(req.body.title)
    queryAdded = true;
  }

  if (req.body.hittingMechanics) {
    if (queryAdded)
      query += `, `
    query += `hittingMechanics = ? `;
    queryData.push(req.body.hittingMechanics)
    queryAdded = true;
  }

  if (req.body.batSpeed) {
    if (queryAdded)
      query += `, `
    query += `batSpeed = ? `;
    queryData.push(req.body.batSpeed)
    queryAdded = true;
  }

  if (req.body.batContact) {
    if (queryAdded)
      query += `, `
    query += `batContact = ? `;
    queryData.push(req.body.batContact)
    queryAdded = true;
  }

  if (req.body.throwingMechanics) {
    if (queryAdded)
      query += `, `
    query += `throwingMechanics = ? `;
    queryData.push(req.body.throwingMechanics)
    queryAdded = true;
  }

  if (req.body.armStrength) {
    if (queryAdded)
      query += `, `
    query += `armStrength = ? `;
    queryData.push(req.body.armStrength)
    queryAdded = true;
  }

  if (req.body.armAccuracy) {
    if (queryAdded)
      query += `, `
    query += `armAccuracy = ? `;
    queryData.push(req.body.armAccuracy)
    queryAdded = true;
  }

  if (req.body.inField) {
    if (queryAdded)
      query += `, `
    query += `inField = ? `;
    queryData.push(req.body.inField)
    queryAdded = true;
  }

  if (req.body.outField) {
    if (queryAdded)
      query += `, `
    query += `outField = ? `;
    queryData.push(req.body.outField)
    queryAdded = true;
  }

  if (req.body.baserunSpeed) {
    if (queryAdded)
      query += `, `
    query += `baserunSpeed = ? `;
    queryData.push(req.body.baserunSpeed)
    queryAdded = true;
  }

  if (req.body.baserunMechanics) {
    if (queryAdded)
      query += `, `
    query += `baserunMechanics = ? `;
    queryData.push(req.body.baserunMechanics)
    queryAdded = true;
  }

  if (req.body.heart) {
    if (queryAdded)
      query += `, `
    query += `heart = ? `;
    queryData.push(req.body.heart)
    queryAdded = true;
  }

  if (req.body.attitude) {
    if (queryAdded)
      query += `, `
    query += `attitude = ? `;
    queryData.push(req.body.attitude)
    queryAdded = true;
  }

  if (req.body.coachability) {
    if (queryAdded)
      query += `, `
    query += `coachability = ? `;
    queryData.push(req.body.coachability)
    queryAdded = true;
  }

  if (!queryAdded)
    return res.status(200).json({ message: "emptyFields" });

  query += `updatedAt = NOW() WHERE userId = UNHEX(?) AND id = UNHEX(?) LIMIT 1`;

  queryData.push(req.user.id);
  queryData.push(req.body.formulaId);

  Promise.using(getConnection(), connection => connection.execute(userQuery, userData))
    .then(data => res.end())
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
