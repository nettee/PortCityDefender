angular.module('ionicApp.controllers', ['ionicApp.services'])

.controller('LoginController', function($scope, $http, $state, userService) {
  $scope.signIn = function(user) {
    $http.get("http://121.40.97.40:3000/user/check-password?username=" + user.username + "&password=" + user.password)
      .success(function (response){
        console.log(response.status);
        if (response.status === "pass"){
          $state.go('menu.firstpage');
          userService.setUsername(user.username);
        }
        else
          alert("用户名或密码错误!");
      })
      .error(function (){
        alert("Login fail!");
        console.log("Login : Fail to send the get request");
	    })
  };
})

.controller('MenuController', function ($scope) {

})

.controller('FirstController', function ($scope,userService) {
  $scope.user = userService.getUser();
})

.controller('UserController', function ($scope,userService) {
  $scope.user = userService.getUser();
})


.controller('ContactsController', function ($scope, $http, userService) {
  var regionlist = ['south', 'west'];
  /*
  $http.get("http://121.40.97.40:3000/regions")
    .success(function (response) {
      regionlist = response;
    })
    .error(function (response) {
      alert("Fail to get the regions");
      console.log("app ConstactsController Fail to get regions --- error message : ", response.error);
    })*/

  $scope.groups = [];

  for (var i = 0; i < regionlist.length; i++) {
    $scope.groups[i] = {
      name: regionlist[i],
      items: [],
      show: false
    };

    var userlist = userService.getUsersByRegion(regionlist[i]);

    for (var j = 0; j < userlist.length; j++) {
      var usertemp = [userlist[j].id,userlist[j].name,userlist[j].level];
      $scope.groups[i].items.push(usertemp);
    }
  }

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    group.show = !group.show;
  };
  $scope.isGroupShown = function(group) {
    return group.show;
  };
})

.controller('ContactController', function ($scope,userService) {

})

