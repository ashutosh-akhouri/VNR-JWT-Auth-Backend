var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var User = require('./backend/models/users');
var passport = require('passport');

// ************************ DB Connection ************************
var dbOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, auto_reconnect: true };
mongoose.connect("mongodb+srv://bz:bz@cluster0-li9qp.mongodb.net/test?retryWrites=true&w=majority", dbOptions);
mongoose.connection.on('connected', () => console.log("Connected to DB"));
mongoose.connection.on('error', (err) => console.log("Error while connecting to DB: " + err));
// ************************ DB Connection ************************

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./backend/config/passport');

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/dist/authTest/index.html'));
});

app.use(express.static(__dirname + '/dist/authTest'));

app.post('/register', async (req, res) => {
	var user = new User({ name: req.body.name, email: req.body.email, password: req.body.password });
	try {
		await user.save();
		var token = user.generateJwt(); // sending token at time of successful registration also
		res.status(200).json({ "token": token });
	} catch (err) {
		res.status(409).json(err);
	}
});

app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
	console.log(req.user);
    var token = req.user.generateJwt();
    // This token should be stored by client and sent with HTTP calls in Authorization Header - Bearer token
	res.status(200).json({ "token": token });
});


// Loading middleware for token validations.
// Any route below this will require valid token 
require('./backend/jwtAuth')(app);

app.post('/profile', async (req, res) => {
	console.log(req.auth); // req.auth contains decoded token payload
	try {
		var user = await (await User.findById(req.auth._id)).toJSON();
		delete user.password;
		res.json(user);
	} catch (err) {
		res.status(400).json(err);
	}
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Server listening ...'));

