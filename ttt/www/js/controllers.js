angular.module('starter')
/*.controller("LoginController", function($state, $sanitize){
	var self = this;
	self.join = function(){

		//sanitize the nickname
		var nickname = $sanitize(self.nickname)
		if(nickname){
			$state.go('home', {nickname : nickname})
		}
	}
});
*/
.controller('RoomsController', function($scope, $http, UserService){ 
    if(!UserService.user.username){ 
      UserService.user.username = prompt("Please enter your username", "");
      $http.post("https://fathomless-brushlands-33586.herokuapp.com/users", UserService.user).then(function(response){ 
        UserService.user = response.data;
        getRooms();
    });
    
  };

  var objDiv = document.getElementById("message-list");
  $scope.createRoom = createRoom;

  function getRooms() {
    $http.get("https://fathomless-brushlands-33586.herokuapp.com/rooms").then(function(response){ 
      $scope.rooms = response.data;
    });
  }

  function createRoom() {
      var room = {
        timestamp: new Date(),
        name: $scope.roomNameToCreate,
        username: UserService.username,
      };
      $http.post("https://fathomless-brushlands-33586.herokuapp.com/rooms", room).then(function(response) {
        $scope.rooms = response.data;
      });
    };
    document.getElementById("roomNameToCreate").value = "";
})

