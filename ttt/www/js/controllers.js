angular.module('starter')

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
        messages: []
        //players: []
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

.controller('SingleRoomController', function($scope, $http, $stateParams, UserService){
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
  });

  /*function sendPlayerMessage() {
    var playerMessage {
        timestamp: new Date(),
        message: UserService.user.username,
        username: UserService.user.username
    };
    $http.post("https://fathomless-brushlands-33586.herokuapp.com/rooms/" + $stateParams.id + "/messages", playerMessage).then(function(response) {
          $scope.messages = response.data.messages;
          console.log($scope.messages);
        });
      document.getElementById("messageToSend").value = "";
      $scope.messageToSend = "";
  }*/

  function getRoom() {
    $http.get("https://fathomless-brushlands-33586.herokuapp.com/rooms/" + $stateParams.id).then(function(response){ 
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
 

 /*.controller('RoomModal', function($scope, $ionicModal) {

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
    });*/
 