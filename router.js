const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// passport wants to make cookie-based session, but we don't want this since we're using jwt
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
	app.get('/', requireAuth, function(req, res) {
		res.send({hi: 'there'});
	});

	app.post('/signin', requireSignin, Authentication.signin);
	app.post('/signup', Authentication.signup);
}