var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var people = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

socket.set("log level", 1);


socket.on("connection", function (client) {

	client.on("join", function(name){
		people[client.id] = name;
		client.emit("update", "You have connected to the server.");
		socket.sockets.emit("update", name + " has joined the server.")
		socket.sockets.emit("update-people", people);
	});

	client.on("send", function(msg){
		socket.sockets.emit("chat", people[client.id], msg);
	});

	client.on("disconnect", function(){
		socket.sockets.emit("update", people[client.id] + " has left the server.");
		delete people[client.id];
		socket.sockets.emit("update-people", people);
	});
});

