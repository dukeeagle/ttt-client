angular.module('starter')

.factory('UserService', function UserService(){
	var user = {
		username: ""
	}
	return{
		user:user
	}
})

	
.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io.connect('https://fathomless-brushlands-33586.herokuapp.com');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
    //socketFactory({ioSocket: io('https://fathomless-brushlands-33586.herokuapp.com/')});
  };
}])

.factory('$localStorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);

/*.factory('application', function ($window) {
    return {
      setInitialRun = function (initial) {
          $window.localStorage["initialRun"] = (initial ? "true" : "false");
      },
      isInitialRun = function () {
         var value = $window.localStorage["initialRun"] || "true";
         return value == "true";
      }
    };
});*/
