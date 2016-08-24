// strategy = method for authenticating a user
// here, one is to verify a user with a JWT
// another can verify a user with a username and password

const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// configure local strategy
const localOptions = {
	usernameField: 'email'
}

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {

	// verify username & password, call done with user
	User.findOne({ email: email }, function(err, user) {
		if (err) {
			return done(err);
		}

		// if user does not exist, it's not an error, but we return with false
		if (!user) {
			return done(null, false);
		}

		// compare passwords 
		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				return done(err);
			}

			if (!isMatch) {
				return done(null, false);
			}

			return done(null, user);
		});
	});
});

// configure JWT strategy
// needs to look at request authorization header for the token
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};

// create JWT strategy
// payload is decoded jwt token (sub and iat)
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {

	// see if user id and payload exists in our db
	User.findById(payload.sub, function(err, user) {
		// if err during search
		if (err) {
			return done(err, false);
		}

		// if user was found, done() called with user, otherwise called with false (didn't find a user, but search had no errors)
		if (user) {
			done(null, user);
		} else {
			done(null, false);
		}
	})
});

// tell passport to use strategies
passport.use(jwtLogin);
passport.use(localLogin);