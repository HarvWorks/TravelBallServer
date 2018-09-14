const Promise           = require("bluebird"),
      getConnection     = require("../../config/mysql"),
      crypto            = require('crypto');

module.exports = async (req, res) => {
  let query       = ``,
      query2      = ``,
      query3      = ``,
      queryData   = [],
      queryData2  = [];

  if (
    !req.body.teamId ||
    !req.body.players ||
    !req.body.players[0] ||
    !req.body.players[0].firstName ||
    !req.body.players[0].position ||
    !req.body.players[0].throwingArm ||
    !req.body.players[0].battingArm
  )
    return res.status(400).json({ message: "missingFields"  });

  const id = crypto.randomBytes(16)

  query = `SELECT teamId, coachType FROM userTeams WHERE userId = UNHEX(?) AND teamId = UNHEX(?)`;

  query2 = `INSERT INTO players (id, teamId, firstName, lastName, teamNumber, birthday, position, throwingArm, battingArm,
    phoneNumber, email, parentFirstName, parentLastName, createdAt, updatedAt) VALUES ?`

  queryData = [
    req.user.id,
    req.body.teamId
  ];

  Promise.using(getConnection(), connection => connection.execute(query, queryData))
    .spread(data => {
      if (!data[0])
        throw {status: 400, message: 'You are not part of this team!'}
      const teamId = data[0].teamId;
      const players = req.body.players;
      const playerLength = players.length;

      for (let i = 0; i < playerLength; i ++) {
        const tempArray = [];
        tempArray.push(id);
        tempArray.push(teamId);
        tempArray.push(players[0].firstName);
        tempArray.push(players[0].lastName ? players[0].lastName : null);
        tempArray.push(players[0].teamNumber ? players[0].teamNumber : null);
        tempArray.push(players[0].birthday ? new Date(players[0].birthday) : null);
        tempArray.push(players[0].position);
        tempArray.push(players[0].throwingArm);
        tempArray.push(players[0].battingArm);
        tempArray.push(players[0].phoneNumber ? players[0].phoneNumber : null);
        tempArray.push(players[0].email || /@/.test(req.body.email) ? players[0].email : null);
        tempArray.push(players[0].parentFirstName ? players[0].parentFirstName : null);
        tempArray.push(players[0].parentLastName ? players[0].parentLastName : null);
        tempArray.push("NOW()");
        tempArray.push("NOW()");
        queryData2.push(tempArray);
      }
      return Promise.using(getConnection(), connection => connection.query(query2, [queryData2]))
    })
    .then(data => res.status(200).json(id.toString('hex')))
    .catch(error => {
      if (error.status)
        return res.status(error.status).json({ message: error.message });
      return res.status(400).json({ message: "admin", error: error });
    });
}
