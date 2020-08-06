var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');

// Passport is a Node module that simplifies the process of handling authentication in Express.
// It provides a common gateway to work with many different authentication “strategies”,
// such as logging in with Facebook, Twitter or Oauth.
// The strategy we’ll use is called “local”, as it uses a username and password stored locally.

// Read more here: http://www.passportjs.org/docs/authenticate/

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (username, password, done) {
        User.findOne({ email: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));