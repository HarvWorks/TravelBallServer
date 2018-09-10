const 	assessment		= require('../controllers/assessment/index.js'),
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

	app.delete('/api/assessment', assessment.delete); // Delete the assessment
	app.get('/api/assessment/one/:id', assessment.get); // Get one assessment
	app.get('/api/assessment/tryout/:id', assessment.getAll); // Get all the assessments of that tryout
	app.post('/api/assessment', assessment.post); // Add a new assessment
	app.put('/api/assessment', assessment.put); // Update an assestment

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
	app.get('/api/formula', formulas.getAll); // Get all the formulas of that user
	app.get('/api/formula/:id', formulas.get); // Get one formula
	app.post('/api/formula', formulas.post); // Add a new formula
	app.put('/api/formula', formulas.put); // Update an formula

	////////////////////////////////////////////////////////////
	//                     Players routes                     //
	////////////////////////////////////////////////////////////

	app.delete('/api/player', players.delete); // Delete the player
	app.get('/api/player', players.getAll); // Get all the players of that user
	app.get('/api/player/:id', players.get); // Get one player
	app.post('/api/player', players.post); // Add a new player
	app.put('/api/player', players.put); // Update an player

	////////////////////////////////////////////////////////////
	//                      Teams routes                      //
	////////////////////////////////////////////////////////////

	app.delete('/api/team', teams.delete); // Delete the team
	app.get('/api/team', teams.getAll); // Get all teams associated with user
	app.get('/api/team/:id', teams.get); // Get that team's detailed info
	app.post('/api/team', teams.post); // Add a new team
	app.put('/api/team', teams.put); // Update an team

	////////////////////////////////////////////////////////////
	//                     Tryouts routes                     //
	////////////////////////////////////////////////////////////

	app.delete('/api/tryout', tryouts.delete); // Delete the tryout has to be head coach
	app.get('/api/tryout', tryouts.getAll); // Get all the tryouts that the user has
	app.get('/api/tryout/:id', tryouts.get); // Get one tryout
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
