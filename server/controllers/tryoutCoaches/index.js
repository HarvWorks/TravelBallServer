module.exports = {
  get: (req, res) => require("./get.js")(req, res),
  post: (req, res) => require("./post.js")(req, res),
  delete: (req, res) => require("./delete.js")(req, res)
}
