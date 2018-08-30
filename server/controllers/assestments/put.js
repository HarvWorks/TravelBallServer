const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [],
      queryAdded  = false;

  if (!req.body.assestmentId)
    return res.status(400).json({ message: "missingFields"  });

  query = `UPDATE assestments SET `;

  if (req.body.hittingMechanics) {
    query += `hittingMechanics = ? `;
    queryData.push(req.body.hittingMechanics)
    queryAdded = true;
  }

  if (req.body.hittingMechanicsNotes) {
    if (queryAdded)
      query += `, `
    query += `hittingMechanicsNotes = ? `;
    queryData.push(req.body.hittingMechanicsNotes)
    queryAdded = true;
  }

  if (req.body.batSpeed) {
    if (queryAdded)
      query += `, `
    query += `batSpeed = ? `;
    queryData.push(req.body.batSpeed)
    queryAdded = true;
  }

  if (req.body.batSpeedNotes) {
    if (queryAdded)
      query += `, `
    query += `batSpeedNotes = ? `;
    queryData.push(req.body.batSpeedNotes)
    queryAdded = true;
  }

  if (req.body.batContact) {
    if (queryAdded)
      query += `, `
    query += `batContact = ? `;
    queryData.push(req.body.batContact)
    queryAdded = true;
  }

  if (req.body.batContactNotes) {
    if (queryAdded)
      query += `, `
    query += `batContactNotes = ? `;
    queryData.push(req.body.batContactNotes)
    queryAdded = true;
  }

  if (req.body.throwingMechanics) {
    if (queryAdded)
      query += `, `
    query += `throwingMechanics = ? `;
    queryData.push(req.body.throwingMechanics)
    queryAdded = true;
  }

  if (req.body.throwingMechanicsNotes) {
    if (queryAdded)
      query += `, `
    query += `throwingMechanicsNotes = ? `;
    queryData.push(req.body.throwingMechanicsNotes)
    queryAdded = true;
  }

  if (req.body.armStrength) {
    if (queryAdded)
      query += `, `
    query += `armStrength = ? `;
    queryData.push(req.body.armStrength)
    queryAdded = true;
  }

  if (req.body.armStrengthNotes) {
    if (queryAdded)
      query += `, `
    query += `armStrengthNotes = ? `;
    queryData.push(req.body.armStrengthNotes)
    queryAdded = true;
  }

  if (req.body.armAccuracy) {
    if (queryAdded)
      query += `, `
    query += `armAccuracy = ? `;
    queryData.push(req.body.armAccuracy)
    queryAdded = true;
  }

  if (req.body.armAccuracyNotes) {
    if (queryAdded)
      query += `, `
    query += `armAccuracyNotes = ? `;
    queryData.push(req.body.armAccuracyNotes)
    queryAdded = true;
  }

  if (req.body.inField) {
    if (queryAdded)
      query += `, `
    query += `inField = ? `;
    queryData.push(req.body.inField)
    queryAdded = true;
  }

  if (req.body.inFieldNotes) {
    if (queryAdded)
      query += `, `
    query += `inFieldNotes = ? `;
    queryData.push(req.body.inFieldNotes)
    queryAdded = true;
  }

  if (req.body.outField) {
    if (queryAdded)
      query += `, `
    query += `outField = ? `;
    queryData.push(req.body.outField)
    queryAdded = true;
  }

  if (req.body.outFieldNotes) {
    if (queryAdded)
      query += `, `
    query += `outFieldNotes = ? `;
    queryData.push(req.body.outFieldNotes)
    queryAdded = true;
  }

  if (req.body.baserunSpeed) {
    if (queryAdded)
      query += `, `
    query += `baserunSpeed = ? `;
    queryData.push(req.body.baserunSpeed)
    queryAdded = true;
  }

  if (req.body.baserunSpeedNotes) {
    if (queryAdded)
      query += `, `
    query += `baserunSpeedNotes = ? `;
    queryData.push(req.body.baserunSpeedNotes)
    queryAdded = true;
  }

  if (req.body.baserunMechanics) {
    if (queryAdded)
      query += `, `
    query += `baserunMechanics = ? `;
    queryData.push(req.body.baserunMechanics)
    queryAdded = true;
  }

  if (req.body.baserunMechanicsNotes) {
    if (queryAdded)
      query += `, `
    query += `baserunMechanicsNotes = ? `;
    queryData.push(req.body.baserunMechanicsNotes)
    queryAdded = true;
  }

  if (req.body.heart) {
    if (queryAdded)
      query += `, `
    query += `heart = ? `;
    queryData.push(req.body.heart)
    queryAdded = true;
  }

  if (req.body.heartNotes) {
    if (queryAdded)
      query += `, `
    query += `heartNotes = ? `;
    queryData.push(req.body.heartNotes)
    queryAdded = true;
  }

  if (req.body.attitude) {
    if (queryAdded)
      query += `, `
    query += `attitude = ? `;
    queryData.push(req.body.attitude)
    queryAdded = true;
  }

  if (req.body.attitudeNotes) {
    if (queryAdded)
      query += `, `
    query += `attitudeNotes = ? `;
    queryData.push(req.body.attitudeNotes)
    queryAdded = true;
  }

  if (req.body.coachability) {
    if (queryAdded)
      query += `, `
    query += `coachability = ? `;
    queryData.push(req.body.coachability)
    queryAdded = true;
  }

  if (req.body.coachabilityNotes) {
    if (queryAdded)
      query += `, `
    query += `coachabilityNotes = ? `;
    queryData.push(req.body.coachabilityNotes)
    queryAdded = true;
  }

  if (!queryAdded)
    return res.status(200).json({ message: "emptyFields" });

  query += `updatedAt = NOW() WHERE userId = UNHEX(?) AND id = UNHEX(?) LIMIT 1`;

  queryData.push(req.user.id);
  queryData.push(req.body.assestmentId);

  Promise.using(getConnection(), connection => connection.execute(userQuery, userData))
    .then(data => res.end())
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
