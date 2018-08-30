const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  if (!req.body.assestmentId)
    return res.status(400).json({ message: "missingFields"  });

  query = `DELETE FROM assestments WHERE userId = UNHEX(?) AND id = UNHEX(?) LIMIT 1`

  queryData = [ req.user.id, req.body.assestmentId ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => res.end())
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
