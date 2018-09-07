const 	assestments		= require('../controllers/assestments/index.js'),
				auth					= require('../controllers/auth/index.js'),
				coaches				= require('../controllers/coaches/index.js'),
				formulas			= require('../controllers/formulas/index.js'),
				players				= require('../controllers/players/index.js'),
				teams					= require('../controllers/teams/index.js'),
				tryouts				= require('../controllers/tryouts/index.js'),
				users					= require('../controllers/users/index.js');

module.exports = function (app) {

	////////////////////////////////////////////////////////////
	//                   Assestments routes                   //
	////////////////////////////////////////////////////////////

	app.delete('/api/assestment', assestments.delete); // Delete the assestment
	app.get('/api/assestment', assestments.get); // Get all the assestments that that the team has done
	app.post('/api/assestment', assestments.post); // Add a new assestment
	app.put('/api/assestment', assestments.put); // Update an assestment

	////////////////////////////////////////////////////////////
	//                  Authenication routes                  //
	////////////////////////////////////////////////////////////

	app.post('/auth/login', auth.login); // Login route
	app.post('/auth/register', auth.register); // Registeration route
	app.post('/auth/forgotPassword', auth.forgotPassword); // Forgot password route
	app.post('/auth/emailVerfication', auth.emailVerification); // Verify email route

	////////////////////////////////////////////////////////////
	//                     Coaches routes                     //
	////////////////////////////////////////////////////////////

	app.delete('/api/coach', coaches.delete); // Delete the coach  has to be head coach or the user itself
	app.get('/api/coach', coaches.get); // Get all the coaches on that team or get all the teams that the user is part of
	app.post('/api/coach', coaches.post); // Add a new coach  has to be head coach

	////////////////////////////////////////////////////////////
	//                     Formulas routes                    //
	////////////////////////////////////////////////////////////

	app.delete('/api/formula', formulas.delete); // Delete the formula
	app.get('/api/formula', formulas.get); // Get all the formulas of that team and user
	app.post('/api/formula', formulas.post); // Add a new formula
	app.put('/api/formula', formulas.put); // Update an formula

	////////////////////////////////////////////////////////////
	//                     Players routes                     //
	////////////////////////////////////////////////////////////

	app.delete('/api/player', players.delete); // Delete the player
	app.get('/api/player', players.get); // Get all the players on that team
	app.post('/api/player', players.post); // Add a new player
	app.put('/api/player', players.put); // Update an player

	////////////////////////////////////////////////////////////
	//                      Teams routes                      //
	////////////////////////////////////////////////////////////

	app.delete('/api/team', teams.delete); // Delete the team
	app.get('/api/team', teams.get); // Get that team's detailed info
	app.post('/api/team', teams.post); // Add a new team
	app.put('/api/team', teams.put); // Update an team

	////////////////////////////////////////////////////////////
	//                     Tryouts routes                     //
	////////////////////////////////////////////////////////////

	app.delete('/api/tryout', tryouts.delete); // Delete the tryout has to be head coach
	app.get('/api/tryout', tryouts.get); // Get all the tryouts that the team has
	app.post('/api/tryout', tryouts.post); // Add a new tryout has to be head coach
	app.put('/api/tryout', tryouts.put); // Update a tryout has to be head coach

	////////////////////////////////////////////////////////////
	//                       User Routes                      //
	////////////////////////////////////////////////////////////

	app.get('/api/user', users.get); // Get the user's Data
	app.delete('/api/user', users.delete); // Delete the user
	app.put('/api/user', users.put); // Update the user's data
	app.get('/api/user/search', users.search); // Search for a user
	app.post('/api/changePassword', users.changePassword); // Change a user's password

}
