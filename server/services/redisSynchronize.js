const Promise       = require('bluebird'),
      client        = require('./redisInit');

const redisSynchronize = (table, id, forced) => {
  let query       = ``,
      token       = "",
      tempData    = [],
      redisData   = [],
      results     = {};

  switch (table) {
    case "userTeams":
      // If the hash was updated within the last five minutes, don't look it up again. Unless it was forced
      if (!forced) {
        const tempTime = client.hget(id, "lastQueried");
        if (tempTime > Date.now() - 300 * 1000)
          throw {message: "queriedGroup"}
      }

      // Grab the team ids from the mysql database
      query = `SELECT HEX(teamId) FROM coaches LEFT JOIN users ON userId = users.id`;
      tempData = await Promise.using(getConnection(), connection => connection.execute(query, [id]));

      redisData = [ id ];

      if (tempData.length === 0) {
        redisData.push("none");
        redisData.push(true);
      }

      for (let i = 0; i < tempData.length; i ++) {
        redisData.push(tempData[i].teamId);
        redisData.push(true);
      };

      
  }
  // Clear out the current
  await client.delAsync(id);
  await client.hmsetAsync(redisData);
  return results
}

module.exports = redisSynchronize;
