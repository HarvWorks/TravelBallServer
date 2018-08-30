const 	auth					= require('../controllers/auth/index.js'),
				auth2					= require('../controllers/auth/index.js'),
				players				= require('../controllers/players/index.js'),
				users					= require('../controllers/users/index.js');

module.exports = function (app) {

	////////////////////////////////////////////////////////////
	//                  Authenication routes                  //
	////////////////////////////////////////////////////////////

	app.post('/login', auth.login); // Login route
	app.post('/register', auth.register); // Registeration route
	app.post('/forgotPassword', auth.forgotPassword); // Forgot password route
	app.post('/emailVerfication', auth.emailVerification); // Verify email route

	////////////////////////////////////////////////////////////
	//                       User Routes                      //
	////////////////////////////////////////////////////////////

	app.get('/api/user', users.get); // Get the user's Data
	app.delete('/api/user', users.delete); // Delete the user
	app.put('/api/user', users.put); // Update the user's data
	app.get('/api/user/search', users.search); // Search for a user
	app.post('/api/changePassword', users.changePassword); // Change a user's password

}
