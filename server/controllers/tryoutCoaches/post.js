const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      Bcrypt            = Promise.promisifyAll(require("bcrypt")),
      crypto            = require('crypto');

module.exports = async (req, res) => {
  let query       = ``,
      query2      = ``,
      queryData   = [],
      queryData2  = [],
      id          = '';

  if (!req.body.userId || !req.body.tryoutId)
    return res.status(400).json({ message: "missingFields" });

  query = `INSERT INTO tryoutCoaches SET tryoutId = UNHEX(?), userId = UNHEX(?), primary = ?, createdAt = NOW(),
    updatedAt = NOW()`;

  queryData = [ req.body.tryoutId, req.body.userId, false ];

  query2 = `UPDATE tryouts SET numberCoaches = numberCoaches + 1 WHERE tryoutId = UNHEX(?)`;

  queryData2  = [ req.body.tryoutId ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(() => Promise.using(getConnection(), connection => connection.execute(query2, queryData2)))
    .then(data => res.status(200).json())
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
