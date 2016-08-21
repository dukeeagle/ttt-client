angular.module('starter')

.controller('SingleRoomController', function($scope, $http, $stateParams, $ionicHistory, socket, $ionicPopup, $localStorage){

  getRoom();

  $scope.myGoBack = $ionicHistory.goBack;

  socket.on('new player', function(newPlayer){
    $scope.room.players.push(newPlayer);
  });

  //The event listeners are duplicating every time this view is reloaded. This needs to be fixed.
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

  /*function getRoom() {
    socket.on()
    /*$http.get("http://localhost:3000/rooms/" + $stateParams.id).then(function(response){
      $scope.room = response.data;
      $scope.messages = response.data.messages;
      $scope.players = response.data.players;
    });*/

  }*/

    //Get Room

    socket.on('roomCreate', function(roomList){
      $scope.rooms = roomList;
    }));


  function sendMessage() {
    var message = {
      timestamp: new Date(),
      message: $scope.messageToSend,
      username: $localStorage.get('name')
    };

    $http.post("http://localhost:3000/rooms/" + $stateParams.id + "/messages", message).then(function(response) {
      $scope.messages = response.data.messages;
      console.log($scope.messages);
    });
    document.getElementById("messageToSend").value = "";
    $scope.messageToSend = "";
  }
});
