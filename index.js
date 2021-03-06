var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    db = require("./models"),
    session = require("express-session"),
    path = require("path");    

var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var nicknames = [];

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: "Spencer's sports secret",
  resave: false,
  saveUninitialized: true
}));

var sessionHelp = function (req, res, next) {
  
  req.login = function (user) {
    req.session.userId = user._id;
  };

  req.currentUser = function (cb) {
     var userId = req.session.userId;
     db.User.
      findOne({
          _id: userId
      }, cb);
  };

  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };

  next(); 
};	

app.use(sessionHelp);

var views = path.join(__dirname, "views");

app.get("/", function (req, res) {
	var homePath = path.join(views, "home.html");
	res.sendFile(homePath);
});  

app.post("/login", function (req,res) {
	var user = req.body.user;

	db.User.authenticate(user.name, user.password, function(err,user) {
		req.login(user);
		res.redirect("/");
	});
});

app.post("/signup", function (req,res) {
	var newUser = req.body.user;

	db.User.createSecure(newUser.name, newUser.password, function(err, user) {
		if (user) {
			req.login(user);
			usersArray.push(user.name);			
			res.redirect("/");
		} else {
			res.redirect("/error");
		};
	})
	req.currentUser();
});

app.get("/topics/1", function (req, res) {
	var topicPath = path.join(views, "pointGuard.html");
	res.sendFile(topicPath);
});

app.get("/topics/2", function (req, res) {
	var thisPath = path.join(views, "betterTeam.html");
	res.sendFile(thisPath);
});

app.get("/topics/3", function (req, res) {
	var thisPath = path.join(views, "sgBattle.html");
	res.sendFile(thisPath);
});

app.get("/d3sgBattle", function (req, res) {
	var thisPath = path.join(views, "d3sgBattle.html");
	res.sendFile(thisPath);
});

app.get("/d3PointGuard", function (req, res) {
	var thisPath = path.join(views, "d3PointGuard.html");
	res.sendFile(thisPath);
});

app.get("/d3PointsPointGuard", function (req, res) {
	var thisPath = path.join(views, "d3PointsPointGuard.html");
	res.sendFile(thisPath);
});

app.get("/d3WSPointGuard", function (req, res) {
	var thisPath = path.join(views, "d3WSPointGuard.html");
	res.sendFile(thisPath);
});

app.get("/d3RosterBetterTeam", function (req, res) {
	var thisPath = path.join(views, "d3RosterBetterTeam.html");
	res.sendFile(thisPath);
});

app.get("/d3TeamWins", function (req, res) {
	var thisPath = path.join(views, "d3TeamWins.html");
	res.sendFile(thisPath);
});

io.sockets.on("connection", function(socket) {
	socket.on("new user", function(data, callback) {
		if (nicknames.indexOf(data) != -1) {
			callback(false);
		} else {
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			updateNicknames();
		}
	});

	function updateNicknames() {
		io.sockets.emit("usernames", nicknames);
	};

	socket.on("send message", function(data) {
		io.sockets.emit("new message", {msg: data, nick: socket.nickname});
	});

	socket.on("disconnect", function(data) {
		if (!socket.nickname) return;
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		updateNicknames();
	});
});

server.listen(process.env.PORT || 3000, function() {
	console.log("running on localhost:3000");
});