var jwt = require('express-jwt'); // https://www.npmjs.com/package/express-jwt

// Middlewares for validating JWT and storing its payload in requestProperty
// For validation, including expiry validation, express-jwt middleware is used.
module.exports = function (app) {
    app.use(jwt({ secret: "Shhh SECRET", algorithms: ['HS256'], requestProperty: 'auth' }));
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.status(401).send('invalid token...');
        }
    });
};
