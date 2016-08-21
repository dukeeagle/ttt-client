angular.module('starter')

.controller('RoomsController', function($scope, $http, $ionicModal, socket, $localStorage, $state, $ionicSlideBoxDelegate){

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


  $scope.nextSlide = function(){
    $ionicSlideBoxDelegate.next();
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
    $http.put("http://localhost:3000/rooms", room).then(function(response){
      $scope.rooms = response.data;
    });
    /*/var deleteRoom = {
     id:
     username:
     }
     $http.put("http://localhost:3000/rooms", room).then(function(response){
     $scope.rooms = response.data;
     });*/
  }

  var objDiv = document.getElementById("message-list");
  $scope.createRoom = createRoom;

  function getRooms() {
    navigator.geolocation.getCurrentPosition(function(position){
      $http.get("http://localhost:3000/rooms").then(function(response){
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
      $http.post("http://localhost:3000/rooms", room).then(function(response) {
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
});
