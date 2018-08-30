const Promise       = require('bluebird'),
      redis         = Promise.promisifyAll(require('redis')),
      client        = redis.createClient();


client.on("error", function (err) {
  console.log("Error " + err);
});

module.exports = client
