module.exports = {
  changePassword: (req, res) => require("./changePassword.js")(req, res),
  search: (req, res) => require("./search.js")(req, res),
  get: (req, res) => require("./get.js")(req, res),
  put: (req, res) => require("./put.js")(req, res),
  delete: (req, res) => require("./del.js")(req, res)
}
