const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

function tokenForUser(user) {
	// encode with secret string
	// sub is a standard - json web tokens have sub property, which is subject (who is this token about, who does it belong to)
	// iat = issued at time
	const timestamp = new Date().getTime();
	return jwt.encode({ 
		sub: user.id, 
		iat: timestamp }, 
	config.secret);
}

exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if(!email || !password) {
		return res.status(422).send({ error: 'You must provide email and password.'});
	}	

	// check if user with given email exists
	User.findOne({ email: email }, function(err, existingUser) {
		if (err) {
			return next(err);
		}

		// if user with email exists, return an error
		if (existingUser) {
			// set http code on response
			return res.status(422).send({ error: 'Email is in use' }); // unprocessable entity
		}

		// if user with email doesn't exist, create and save user record
		const user = new User({
			email: email,
			password: password
		});

		// respond to request, indicating user was created
		user.save(function(err) {
			if (err) {
				return next(err);
			}

			// success - when the user signs up successfully we consider them signed in, so we need to send provide a token.
			res.json({ token: tokenForUser(user) });
		});
	});
}

exports.signin = function(req, res, next) {

}