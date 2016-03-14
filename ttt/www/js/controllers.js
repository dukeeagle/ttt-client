angular.module('starter')
//Akademia Heroku Server: https://polar-caverns-57560.herokuapp.com/
//TTT Heroku Server: https://fathomless-brushlands-33586.herokuapp.com/
.controller('RoomsController', function($scope, $http, UserService, $ionicModal){
    if(!UserService.user.username){ 
      UserService.user.username = prompt("Please enter your username", "");
      $http.post("https://fathomless-brushlands-33586.herokuapp.com/users", UserService.user).then(function(response){ 
        UserService.user = response.data;
        getRooms();
      });
    }


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
        messages: [],
        players: []
      };
      $http.post("https://fathomless-brushlands-33586.herokuapp.com/rooms", room).then(function(response) {
        $scope.rooms = response.data;
      });
    
    document.getElementById("roomNameToCreate").value = "";
  }

  $ionicModal.fromTemplateUrl('templates/room-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
        $scope.modal.show();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function(){
        $scope.modal.remove();
    });

    //Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        //action
    });

    //Execute action on modal removal
    $scope.$on('modal.removed', function() {
        //action
    });

    $scope.submitRoom = function() {
        $scope.closeModal();
        $scope.createRoom();
    }

})

.controller('SingleRoomController', function($scope, $http, $stateParams, UserService, $ionicHistory, socket){
  getRoom();
  $scope.sendMessage = sendMessage;
  $scope.$on('$ionicView.afterEnter', function() {
      var testMessage = {
            timestamp: new Date(),
            message: "has joined the game!",
            username: UserService.user.username
      };
      $http.post("https://fathomless-brushlands-33586.herokuapp.com/rooms/" + $stateParams.id + "/messages", testMessage).then(function(response) {
          $scope.messages = response.data.messages;
          console.log($scope.messages);
        });
      document.getElementById("messageToSend").value = "";
      $scope.messageToSend = "";

      var enterPlayer = {
          timestamp: new Date(),
          player: UserService.user.username
      };
      $http.post("https://fathomless-brushlands-33586.herokuapp.com/rooms/" + $stateParams.id + "/players", enterPlayer).then(function(resposne) {
          $scope.players = response.data.players;
          console.log($scope.players);
      });
      var newPlayer = UserService.user.username;
      socket.emit('player enter', newPlayer);
  });
  $scope.myGoBack = function() {
      $ionicHistory.goBack();
  };
  socket.on('new player', function(newPlayer){
      $scope.room.players.push(newPlayer);
  });
   /*$scope.$on('$ionicView.afterLeave', function(){

   });*/


  function getRoom() {
    $http.get("https://fathomless-brushlands-33586.herokuapp.com/rooms/" + $stateParams.id).then(function(response){ 
      $scope.room = response.data;
      $scope.messages = response.data.messages;
      $scope.players = response.data.players;
    });
    setTimeout(getRoom, 1000);
  }
    function sendMessage() {
        var message = {
          timestamp: new Date(),
          message: $scope.messageToSend,
          username: UserService.user.username
        };
        
        $http.post("https://fathomless-brushlands-33586.herokuapp.com/rooms/" + $stateParams.id + "/messages", message).then(function(response) {
          $scope.messages = response.data.messages;
          console.log($scope.messages);
      });
      document.getElementById("messageToSend").value = "";
      $scope.messageToSend = "";
    }
})

 .controller('RoomCreator', function($scope, $http, $stateParams, UserService, $ionicModal){
    $scope.createRoom = createRoom;
      function createRoom(){
        var room = {
          timestamp: new Date(),
          name: $scope.roomNameToCreate,
          username: UserService.username
    };
  };
});
 