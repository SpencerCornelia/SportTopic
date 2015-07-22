var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);

var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	passwordDigest: {
		type: String,
		required: true
	}

});

userSchema.statics.createSecure = function (name, password, cb) {
	var that = this;
	bcrypt.genSalt(function (err, salt) {
		bcrypt.hash(password, salt, function (err, hash) {
			console.log(hash);
			that.create({
				name: name,
				passwordDigest: hash
			}, cb);
		});
	});
};

userSchema.statics.encryptPassword = function (password) {
	var hash = bcrypt.hashSync(password, salt);
	return hash;
};

userSchema.statics.authenticate = function(name, password, cb) {
	this.findOne({
		name: name
	},
	function(err,user){
		if (user === null){
			throw new Error("Username does not exist");
		} else if (user.checkPassword(password)){
			cb(null, user);
		}
	})
};

userSchema.methods.checkPassword = function(password) {
	return bcrypt.compareSync(password, this.passwordDigest);
};

var User = mongoose.model("User", userSchema);
module.exports = User;