const Promise = require("bluebird");
const getConnection = require("../../config/mysql");

module.exports = async (req, res) => {
  let query       = ``,
      queryData   = [];

  if (!req.body.coachId)
    return res.status(400).json({ message: "missingFields"  });

    query = `DELETE FROM userRelationship WHERE userId1 = UNHEX(?) AND userId2 = UNHEX(?) OR userId1 = UNHEX(?)
      AND userId2 = UNHEX(?) LIMIT 2`
    queryData = [ req.body.coachId, req.user.id, req.user.id,  req.body.coachId ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .then(data => res.end())
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
