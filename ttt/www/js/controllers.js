angular.module('starter')

.controller('RoomsController', function($scope, $http, UserService){
    if(!UserService.user.username){ 
      UserService.user.username = prompt("Please enter your username", "");
      $http.post("https://polar-caverns-57560.herokuapp.com/users", UserService.user).then(function(response){ 
        UserService.user = response.data;
        getRooms();
    });
    }


  var objDiv = document.getElementById("message-list");
  $scope.createRoom = createRoom;

  function getRooms() {
    $http.get("https://polar-caverns-57560.herokuapp.com/rooms").then(function(response){ 
      $scope.rooms = response.data;
    });
  }

  function createRoom() {
      var room = {
        timestamp: new Date(),
        name: $scope.roomNameToCreate,
        username: UserService.username,
        messages: []
      };
      $http.post("https://polar-caverns-57560.herokuapp.com/rooms", room).then(function(response) {
        $scope.rooms = response.data;
      });
    
    document.getElementById("roomNameToCreate").value = "";
  }
})

.controller('SingleRoomController', function($scope, $http, $stateParams, UserService){
  getRoom();
  $scope.sendMessage = sendMessage;

  function getRoom() {
    $http.get("https://polar-caverns-57560.herokuapp.com/rooms/" + $stateParams.id).then(function(response){ 
      $scope.room = response.data;
      $scope.messages = response.data.messages;
    });
    setTimeout(getRoom, 1000);
  }
    function sendMessage() {
        var message = {
          timestamp: new Date(),
          message: $scope.messageToSend,
          username: UserService.user.username
        };
        $http.post("https://polar-caverns-57560.herokuapp.com/rooms/" + $stateParams.id + "/messages", message).then(function(response) {
          $scope.messages = response.data.messages;
          console.log($scope.messages);
      });
      document.getElementById("messageToSend").value = "";
      $scope.messageToSend = "";
    }
})

 .controller('RoomCreator', function($scope, $http, $stateParams, UserService){
    $scope.createRoom = createRoom;
      function createRoom(){
        var room = {
          timestamp: new Date(),
          name: $scope.roomNameToCreate,
          username: UserService.username
      };
    };
 });