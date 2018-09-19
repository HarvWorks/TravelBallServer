const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      crypto            = require('crypto');

module.exports = async (req, res) => {
  let query       = ``,
      query2      = ``,
      query3      = ``,
      query4      = ``,
      queryData   = []
      queryData2  = [],
      queryData3  = [],
      queryData4  = [],
      length      = 0,
      tryoutId    = '',
      tempCoaches = [],
      coaches     = [],
      coachIds   = [];


  if (!req.body.id || !req.body.coaches || req.body.coaches[0] && !req.body.coaches[0].value)
    return res.status(400).json({ message: "missingFields" });

  query = `SELECT tryoutId FROM tryoutCoaches WHERE tryoutId = UNHEX(?) AND userId = UNHEX(?)`;
  queryData = [ req.body.id, req.user.id ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .spread(data => {
      if (!data[0] && !data[0].tryoutId)
        throw {status: 400, message: 'Looks like you are not part of this team.'}
      tryoutId = data[0].tryoutId;

      // Now add the queries to both delete the extra coaches and add in the new ones
      tempCoaches = req.body.coaches ? req.body.coaches : [];
      // Add the owner of the tryouts
      tempCoaches.push({value: req.user.id})
      if ( req.body.coaches.length > 1 ) {
        length = tempCoaches.length;
        for (let i = 0; i < length; i ++) {
          if (!/^[0-9a-fA-F]{32}$/.test(tempCoaches[i].value)){
            throw { status: 400, message: "badUUID" };
          }
          coachIds.push(new Buffer(tempCoaches[i].value, 'hex'))
          coaches.push([tryoutId, new Buffer(tempCoaches[i].value, 'hex'), false, "NOW()", "NOW()"])
        }
        query2 = `DELETE FROM tryoutCoaches WHERE tryoutId = ? AND userId NOT IN (?)`;
        queryData2 = [tryoutId, coachIds];
        query3 = `INSERT IGNORE INTO tryoutCoaches (tryoutId, userId, primaryCoach, createdAt, updatedAt) VALUES ?`;
        queryData3 = [coaches];
      } else {
        query2 = `DELETE FROM tryoutCoaches WHERE tryoutId = ? AND userId NOT IN (?)`;
        queryData2 = [tryoutId, tempCoaches[0].value];
        query3 = `INSERT IGNORE INTO tryoutCoaches SET tryoutId = ?, userId = UNHEX(?), primaryCoach = false,
          createdAt = NOW(), updatedAt = NOW()`;
        queryData3 = [tryoutId, tempCoaches[0].value];
      }
      // Also set up the query for counting the number of coaches
      query4 = `UPDATE tryouts SET numberCoaches = ? WHERE id = ?`;
      queryData4  = [ coaches.length - 1, tryoutId ];

      return Promise.using(getConnection(), connection => connection.query(query2, queryData2))
    })
    .then(() => Promise.using(getConnection(), connection => connection.query(query3, queryData3)))
    .then(() => Promise.using(getConnection(), connection => connection.execute(query4, queryData4)))
    .then(data => res.status(200).json())
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
