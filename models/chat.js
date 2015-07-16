var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var chatSchema = new mongoose.Schema({
	nick: String,
	msg: String,
	created: {
		type: Date,
		default: Date.now
	}
});

var Chat = mongoose.model("Message", chatSchema);
module.exports = Chat;