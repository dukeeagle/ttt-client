angular.module('starter')
//TTT Heroku Server: https://fathomless-brushlands-33586.herokuapp.com/
.config(function($ionicConfigProvider){
    $ionicConfigProvider.navBar.alignTitle('center');
})





.controller('RoomsController', function($scope, $http, UserService, $ionicModal, socket, $localStorage, $state){
    /*var state = "room-list";

     if (Application.isInitialRun()) {
           Application.setInitialRun(false);
           state = "first-time";
     }

    $state.go(state);*/
    
    //TEST
    socket.on('disconnect', function(socket){
        console.log(socket + 'disconnected!');
    })
    socket.on('joined', function(){
        console.log('a user has joined!');
    })
    socket.on('joinedRoom', function(){
        console.log('a user has joined this room!');
    })
    socket.on('playersInRoom', function(roomSockets){
        console.log(roomSockets);
    })

    if($localStorage.get('name') == undefined){
        $state.go('first-time');
    }


    if(!UserService.user.username){
      navigator.geolocation.getCurrentPosition(function(position){ 
        //UserService.user.username = prompt("Please enter your username", "");
        var user ={
          username:$localStorage.get('name'),
          lat:position.coords.latitude,
          lon:position.coords.longitude
        }
        $http.post("https://fathomless-brushlands-33586.herokuapp.com/users", user).then(function(response){ 
          //UserService.user = response.data;
          var username = $localStorage.get('name');
          socket.emit('addUser', username);
          getRooms();
        });
      });
    }

  $scope.data = {
      showDelete: false
  };

  $scope.returnHome = function(){
    $state.go('home');
    getRooms();
  }

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
    navigator.geolocation.getCurrentPosition(function(position){
      $http.get("https://fathomless-brushlands-33586.herokuapp.com/rooms").then(function(response){ 
        $scope.rooms = response.data;
        
      });
      /*for(i = rooms.data.length - 1; i >= 0; i--){
        var close = haversine(position.coords.latitude, position.coords.longitude, $scope.rooms[i].lat, $scope.rooms[i].long);
        $scope.rooms[i].isClose = close;
      }*/
    });
    setTimeout(getRooms, 1500);
  }

  function createRoom() {
      navigator.geolocation.getCurrentPosition(function(position){
      var creatorName = $localStorage.get('name');
      var room = {
        timestamp: new Date(),
        name: $scope.modal1.roomNameToCreate,
        username: creatorName,
        lat:position.coords.latitude,
        lon:position.coords.longitude,
        messages: [],
        players: []
      };
      if(room.name == undefined){
        room.name = $localStorage.get('name') + "\'s Room";
      }
      $http.post("https://fathomless-brushlands-33586.herokuapp.com/rooms", room).then(function(response) {
        $scope.rooms = response.data;
        socket.emit('newRoom', room.name);
      });
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
        $scope.modal2.remove();
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
        $scope.modal1.remove();
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
        
    };

    $scope.changeName = function(){
        var newName = $scope.modal2.userNameToChange;
        $localStorage.set('name',  newName);
        console.log($localStorage.get('name'));
        document.getElementById("userNameToChange").value = "";
    };
})





.controller('SingleRoomController', function($scope, $http, $stateParams, UserService, $ionicHistory, socket, $ionicPopup, $localStorage){
    /*if(!UserService.user.username){ 
        var user ={
          username:$localStorage.get('name')
        }
        $http.post("https://fathomless-brushlands-33586.herokuapp.com/users", user).then(function(response){ 
          var username = $localStorage.get('name');
          socket.emit('addUser', username);
          getRooms();
        });
    }*/
  getRoom();
  $scope.sendMessage = sendMessage;
  $scope.$on('$ionicView.afterEnter', function() {
      var testMessage = {
            timestamp: new Date(),
            message: "has joined the game!",
            username: $localStorage.get('name')
      };
      $http.post("https://fathomless-brushlands-33586.herokuapp.com/rooms/" + $stateParams.id + "/messages", testMessage).then(function(response) {
          $scope.messages = response.data.messages;
          console.log($scope.messages);
        });
      document.getElementById("messageToSend").value = "";
      $scope.messageToSend = "";

      var enterPlayer = {
          username: $localStorage.get('name')
      };
      $http.post("https://fathomless-brushlands-33586.herokuapp.com/rooms/" + $stateParams.id + "/players", enterPlayer).then(function(response) {
          $scope.players = response.data.players;
          console.log($scope.players);
      });
      thisRoom = $scope.room;
      socket.emit('enterRoom', thisRoom, $localStorage.get('name'));
  });
  $scope.myGoBack = function() {
      $ionicHistory.goBack();
  };
  socket.on('new player', function(newPlayer){
      $scope.room.players.push(newPlayer);
  });
  $scope.$on('$ionicView.afterLeave' || '$ionicView.unloaded', function() {
      var finalMessage = {
          timestamp: new Date(),
          message: "has left the game",
          username: $localStorage.get('name')
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
          username: $localStorage.get('name')
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
          okType: 'button-assertive'
      });

      alertPopup.then(function(res){
          console.log('confirmed');
      });
  };

  $scope.showInnocent = function(){
      var alertPopup = $ionicPopup.alert({
          title: 'You are INNOCENT.',
          template: 'Eliminate the traitor before it\'s too late!',
          okType: 'button-assertive'
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
          username: $localStorage.get('name')
        };
        
        $http.post("https://fathomless-brushlands-33586.herokuapp.com/rooms/" + $stateParams.id + "/messages", message).then(function(response) {
          $scope.messages = response.data.messages;
          console.log($scope.messages);
      });
      document.getElementById("messageToSend").value = "";
      $scope.messageToSend = "";
    }
})





 .controller('RoomCreator', function($scope, $http, $stateParams, UserService, $ionicModal, $localStorage){
    $scope.createRoom = createRoom;
      function createRoom(){
        var room = {
          timestamp: new Date(),
          //name: $scope.roomNameToCreate,
          name: UserService.user.username + "'s Room" + $scope.modal1.roomNameToCreate,
          username: $localStorage.get('name')
    };
  };
});
 