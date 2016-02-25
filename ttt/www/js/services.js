angular.module('starter')

.factory('UserService', function UserService(){
	var user = {
		username: ""
	}
	return{
		user:user
	}
});

/*.factory('socket', function(socketFactory)){
	var myIoSocket = io.connect('https://fathomless-brushlands-33586.herokuapp.com/');

	mySocket = socketFactory({
		ioSocket: myIoSocket
	});

	return mySocket;
<<<<<<< HEAD
}*/

