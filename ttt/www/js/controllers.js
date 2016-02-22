angular.module('starter')

.controller('RoomsController', function($scope, $http, UserService){
	if(!UserService.user.username){
		UserService.user.username = prompt("Please enter your name", "");
		$http.post("https://fathomless-brushlands-33586.herokuapp.com/", UserService.user).then(function(response){
			UserService.user = response.data;
			getRooms();
		});
	}

	var objDiv = document.getElementById("room-list");
	$scope.createRoom = createRoom;

	function getRooms(){
		$http.get("https://fathomless-brushlands-33586.herokuapp.com/").then(function(response){
			$scope.rooms = response.data;
		});
	}

	function createRoom(){
		var room = {
			timestamp: new Date(),
			name: $scope.roomNameToCreate,
			//players[]
		}
		$http.post("https://fathomless-brushlands-33586.herokuapp.com/", room).then(function(response){
			$scope.rooms = response.data;
		});
		document.getElementById("roomNameToCreate").value = "";
	}
})