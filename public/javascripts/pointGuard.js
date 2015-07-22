$(function() {
	var socket = io.connect();
	var $messageForm = $("#send-message");
	var $messageBox = $("#message");
	var $chat = $("#chat");
	var $nickForm = $("#setNick");
	var $nickError = $("#nickError");
	var $nickWrap = $("#nickWrap");
	var $nickBox = $("#nickname");
	var $users = $("#signedInUsers");

	$chat.hide();

	$nickForm.submit(function (e) {
		e.preventDefault();
		socket.emit("new user", $nickBox.val(), function(data) {
			if (data) {
				$nickWrap.hide();
				$chat.show();
			} else {
				$nickError.html("That user is already taken. Please enter another name!");
			}
		});
		$nickBox.val("");
	});
	
	socket.on("usernames", function(data) {
		var html = "";
		for (var i = 0; i < data.length; i++) {
			html += data[i] + "<br/>";
		}
		$users.html(html);
	});

	$messageForm.submit(function(e) {
		e.preventDefault();
		socket.emit("send message", $messageBox.val());
		$messageBox.val("");
	});

	socket.on("new message", function(data) {
		$("#chat2").append("<b>" + data.nick + ": </b>" + data.msg + "</br>");
	});

}); 