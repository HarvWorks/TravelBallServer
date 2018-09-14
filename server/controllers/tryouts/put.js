const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = []
      queryAdded  = false;

  if (!req.body.id)
    return res.status(400).json({ message: "missingFields"  });

  query = `UPDATE tryouts SET `;

  if (req.body.name) {
    query += `name = ? `;
    queryData.push(req.body.name)
    queryAdded = true;
  }

  if (req.body.street) {
    if (queryAdded)
      query += `, `
    query += `street = ? `;
    queryData.push(req.body.street)
    queryAdded = true;
  }

  if (req.body.city) {
    if (queryAdded)
      query += `, `
    query += `city = ? `;
    queryData.push(req.body.city)
    queryAdded = true;
  }

  if (req.body.state) {
    if (queryAdded)
      query += `, `
    query += `state = ? `;
    queryData.push(req.body.state)
    queryAdded = true;
  }

  if (req.body.zip) {
    if (queryAdded)
      query += `, `
    query += `zip = ? `;
    queryData.push(req.body.zip)
    queryAdded = true;
  }

  if (req.body.country) {
    if (queryAdded)
      query += `, `
    query += `country = ? `;
    queryData.push(req.body.country)
    queryAdded = true;
  }

  if (req.body.formulaId) {
    if (queryAdded)
      query += `, `
    query += `formulaId = UNHEX(?) `;
    queryData.push(req.body.formulaId)
    queryAdded = true;
  }

  if (!queryAdded)
    return res.status(200).json({ message: "emptyFields" });

  query += `, updatedAt = NOW() WHERE id IN (SELECT tryoutId FROM tryoutCoaches WHERE tryoutId = UNHEX(?)
    AND userId = UNHEX(?)) LIMIT 1`;

  queryData.push(req.body.id);
  queryData.push(req.user.id);

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => {
      console.log(data);
      return res.end()
    })
    .catch(error => {
      console.log(error);
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
