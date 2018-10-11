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
    !req.body.players[0]
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
        if (
          !players[i].firstName ||
          !players[i].position ||
          !players[i].throwingArm ||
          !players[i].battingArm ||
          !players[i].parentFirstName ||
          !players[i].parentLastName ||
          !players[i].phoneNumber ||
          !players[i].emgFirstName ||
          !players[i].emgLastName ||
          !players[i].emgPhoneNumber
        )
          throw { status: 400, message: "missingFields" };
        const tempArray = [];
        tempArray.push(id);
        tempArray.push(teamId);
        tempArray.push(players[i].firstName);
        tempArray.push(players[i].lastName ? players[i].lastName : null);
        tempArray.push(players[i].teamNumber ? players[i].teamNumber : null);
        tempArray.push(players[i].birthday ? new Date(players[i].birthday) : null);
        tempArray.push(players[i].position);
        tempArray.push(players[i].position2 ? players[i].position2 : null);
        tempArray.push(players[i].pitcher ? players[i].pitcher : null);
        tempArray.push(players[i].catcher ? players[i].catcher : null);
        tempArray.push(players[i].throwingArm);
        tempArray.push(players[i].battingArm);
        tempArray.push(players[i].parentFirstName);
        tempArray.push(players[i].parentLastName);
        tempArray.push(players[i].phoneNumber);
        tempArray.push(players[i].email || /@/.test(players[i].email) ? players[i].email : null);
        tempArray.push(players[i].parentFirstName2 ? players[i].parentFirstName2 : null);
        tempArray.push(players[i].parentLastName2 ? players[i].parentLastName2 : null);
        tempArray.push(players[i].phoneNumber2 ? players[i].phoneNumber2 : null);
        tempArray.push(players[i].email2 || /@/.test(players[i].email2) ? players[i].email2 : null);
        tempArray.push(players[i].emgFirstName);
        tempArray.push(players[i].emgLastName);
        tempArray.push(players[i].emgPhoneNumber);
        tempArray.push(players[i].emgEmail || /@/.test(players[i].emgEmail) ? players[i].emgEmail : null);
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
