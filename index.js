var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
<<<<<<< HEAD
var clients = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket){
	socket.on('add-user', function(data){
		clients[data.username] = {
			"socket":socket.id
		};
	});

    socket.on('disconnect', function(){
	for(var name in clients){
			if(clients[name].socket === socket.id){
					
					delete clients[name];
					break;
			}
	}
	})

});

http.listen(3000, function(){
  console.log('listening on *:3000');

});

