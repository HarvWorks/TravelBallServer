module.exports = {
  emailVerification: (req, res) => require("./emailVerification.js")(req, res),
  forgotPassword: (req, res) => require("./forgotPassword.js")(req, res),
  login: (req, res) => require("./login.js")(req, res),
  register: (req, res) => require("./register.js")(req, res),
}
