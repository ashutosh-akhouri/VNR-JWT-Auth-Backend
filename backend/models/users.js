var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var jwt = require('jsonwebtoken'); // Library for JSON Web Token (JWT) https://www.npmjs.com/package/jsonwebtoken

// Mongoose schema describing fields of a document in Users collection.
// Add any other field that are required for a user profile. e.g. role - admin/guest/author
var userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true } // For simplicity, storing plain password; should store encrypted.
});


// Instance methods provide convinient way to do something on a particular document
// Read more here: https://mongoosejs.com/docs/guide.html#methods

userSchema.methods.validPassword = function (pwd) {
    // Here 'this' refers to current user document retrieved from DB.
    // Again, we should use encryption here and passowrd match logic will change accordingly.
    return this.password === pwd;
};

userSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000),
    }, "Shhh SECRET");
    // For simplicity, hard coding secret. Secret should be stored in secret config store and read from there.
};


// Creating Model for Schema
var User = mongoose.model('User', userSchema);

// Exporting model
module.exports = User;

