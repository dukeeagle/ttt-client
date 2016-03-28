angular.module('starter')
//TTT Heroku Server: https://fathomless-brushlands-33586.herokuapp.com/
.config(function($ionicConfigProvider){
    $ionicConfigProvider.navBar.alignTitle('center');
})

.controller('RoomsController', function($scope, $http, UserService, $ionicModal, socket){
    if(!UserService.user.username){ 
      UserService.user.username = prompt("Please enter your username", "");
      $http.post("https://fathomless-brushlands-33586.herokuapp.com/users", UserService.user).then(function(response){ 
        UserService.user = response.data;
        var username = UserService.user.username;
        socket.emit('addUser', username);
        getRooms();
      });
    }

  $scope.data = {
      showDelete: false
  };

  $scope.onRoomDelete = function(room){
      //$scope.rooms.splice($scope.rooms.indexOf(room), 1);
      var rooms = $scope.rooms;
      $http.put("https://fathomless-brushlands-33586.herokuapp.com/rooms", room).then(function(response){
        $scope.rooms = response.data;
      });
      /*/var deleteRoom = {
          id: 
          username:
      }
      $http.put("https://fathomless-brushlands-33586.herokuapp.com/rooms", room).then(function(response){
        $scope.rooms = response.data;
      });*/
  }

  var objDiv = document.getElementById("message-list");
  $scope.createRoom = createRoom;

  function getRooms() {
    $http.get("https://fathomless-brushlands-33586.herokuapp.com/rooms").then(function(response){ 
      $scope.rooms = response.data;
    });
    setTimeout(getRooms, 1500);
  }

  

  function createRoom() {
      //$scope.modal1= {}
      var room = {
        timestamp: new Date(),
        //name: $scope.roomNameToCreate,
        name: $scope.modal1.roomNameToCreate,
        username: UserService.user.username,
        messages: [],
        players: []
      };
      $http.post("https://fathomless-brushlands-33586.herokuapp.com/rooms", room).then(function(response) {
        $scope.rooms = response.data;
        socket.emit('newRoom', room.name);
      });
    
    document.getElementById("roomNameToCreate").value = "";
  }

  $ionicModal.fromTemplateUrl('templates/info-modal.html', {
      id: '2',
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal2 = modal;
    });

    $scope.$on('$destroy', function(){
        $scope.modal.remove();
    });


  $ionicModal.fromTemplateUrl('templates/room-modal.html', {
      id: '1',
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal1 = modal;
    });

    $scope.openModal = function(index) {
        if(index == 1) $scope.modal1.show();
        else $scope.modal2.show();
    };

    $scope.closeModal = function(index) {
        if(index == 1) $scope.modal1.hide();
        else $scope.modal2.hide();
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
        $scope.createRoom();
        $scope.closeModal(1);
        
    }

})

.controller('SingleRoomController', function($scope, $http, $stateParams, UserService, $ionicHistory, socket, $ionicPopup){
    if(!UserService.user.username){ 
      UserService.user.username = prompt("Please enter your username", "");
      $http.post("https://fathomless-brushlands-33586.herokuapp.com/users", UserService.user).then(function(response){ 
        UserService.user = response.data;
        var username = UserService.user.username;
        socket.emit('addUser', username);
      });
    }

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
          username: UserService.user.username
      };
      $http.post("https://fathomless-brushlands-33586.herokuapp.com/rooms/" + $stateParams.id + "/players", enterPlayer).then(function(response) {
          $scope.players = response.data.players;
          console.log($scope.players);
      });
      thisRoom = $scope.room;
      socket.emit('enterRoom', thisRoom, UserService.user.username);
  });
  $scope.myGoBack = function() {
      $ionicHistory.goBack();
  };
  socket.on('new player', function(newPlayer){
      $scope.room.players.push(newPlayer);
  });
  $scope.$on('$ionicView.afterLeave', function() {
      var finalMessage = {
          timestamp: new Date(),
          message: "has left the game",
          username: UserService.user.username
      };
      $http.post("https://fathomless-brushlands-33586.herokuapp.com/rooms/" + $stateParams.id + "/messages", finalMessage).then(function(response) {
          $scope.messages = response.data.messages;
          console.log($scope.messages);
          playerList = $scope.players;
          socket.emit('player left', playerList);
        });
      document.getElementById("messageToSend").value = "";
      $scope.messageToSend = "";

      var leavePlayer = {
          username: UserService.user.username
      };
      $http.put("https://fathomless-brushlands-33586.herokuapp.com/rooms/" + $stateParams.id + "/players", leavePlayer).then(function(response) {
          $scope.players = response.data.players;
          console.log($scope.players);
      });

      var leftRoom = $scope.room;
      socket.emit('leaveRoom', leftRoom);

   });
  socket.on('traitor', function(){
      $scope.showTraitor();
      console.log('The traitor has been determined!');
  });
  socket.on('innocent', function(){
      $scope.showInnocent();
  });

  $scope.startGame = function(){
      var room = $scope.room;
      socket.emit('gameStart', room);

  };

  $scope.showTraitor = function(){
      
      var alertPopup = $ionicPopup.alert({
          title: 'You are the TRAITOR!',
          template: 'Assassinate everyone in sight!',
          okType: 'button-royal'
      });

      alertPopup.then(function(res){
          console.log('confirmed');
      });
  };

  $scope.showInnocent = function(){
      var alertPopup = $ionicPopup.alert({
          title: 'You are INNOCENT.',
          template: 'Eliminate the traitor before it\'s too late!',
          okType: 'button-royal'
      });
  };

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
          //name: $scope.roomNameToCreate,
          name: UserService.user.username + "'s Room" + $scope.modal1.roomNameToCreate,
          username: UserService.user.username
    };
  };
});
 