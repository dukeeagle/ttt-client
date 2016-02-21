angular.module('starter')
.factory('socket', function(socketFactory)){
	var myIoSocket = io.connect('https://fathomless-brushlands-33586.herokuapp.com/');

	mySocket = socketFactory({
		ioSocket: myIoSocket
	});

	return mySocket;
}