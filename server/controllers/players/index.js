module.exports = {
  get: (req, res) => require("./get.js")(req, res),
  getRecent: (req, res) => require("./getRecent.js")(req, res),
  getAll: (req, res) => require("./getAll.js")(req, res),
  post: (req, res) => require("./post.js")(req, res),
  put: (req, res) => require("./put.js")(req, res),
  delete: (req, res) => require("./delete.js")(req, res)
}
