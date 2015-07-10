var express = require("express"),
    bodyParser = require("body-parser"),
    path = require("path");

var app = express();

app.use(express.static("public"));
app.use(express.static("bower_components"));

app.use(bodyParser.urlencoded({extended: true}));

var views = path.join(__dirname, "views")

app.get("/", function (req, res) {
	var homePath = path.join(views, "home.html");
	res.sendFile(homePath);
});  

app.listen(3000, function() {
	console.log("running on localhost:3000");
})