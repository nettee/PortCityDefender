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


.controller('ContactsController', function ($scope, $http, userService, regionService) {
  var regionlist = [];
  $scope.groups = [];

  $http.get("http://121.40.97.40:3000/regions")
    .success(function (response) {
      regionlist = response;
      for (var i = 0; i < regionlist.length; i++) {
        $scope.groups[i] = {
          name: regionlist[i],
          items: [],
          show: false
        };
      }
    })
    .error(function (response) {
      alert("Fail to get the regions");
      console.log("app ConstactsController Fail to get regions --- error message : ", response.error);
    })


/*
  for (var i = 0; i < regionlist.length; i++) {
    alert(1);
    $scope.groups[i] = {
      name: regionlist[i],
      items: [],
      show: false
    };
    console.log($scope.groups[i].name);
    var userlist = userService.getUsersByRegion(regionlist[i]);

    for (var j = 0; j < userlist.length; j++) {
      var usertemp = [userlist[j].id,userlist[j].name,userlist[j].level];
      $scope.groups[i].items.push(usertemp);
    }
  }*/

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    group.show = !group.show;
    for (var i = 0; i < regionlist.length; i++) {
      $http.get("http://121.40.97.40:3000/users?region=" + regionlist[i])
        .success(function (response) {
          for (var j = 0;j < response.length;i++){
            $scope.groups[0].items.push(response[j]);
          }
        })
        .error(function (response) {
          alert("Fail to get the users by region : " + region);
          console.log("app userService method-getUserByRegion Fail to get---error message : ", response.error);
        })
    }
  }
  $scope.isGroupShown = function(group) {
    return group.show;
  };

  /**
   * Below is the search
   */
  var searchisnull = true;
  var searchResults = [];
  $scope.search = function (searchcontent) {
    if (searchcontent == '')
      searchisnull = true;
    else {
      searchResults = userService.filterUserByName(searchcontent);
      searchisnull = false;
    }
  }
})

.controller('ContactController', function ($scope,$stateParams, userService) {
  var username = $stateParams.contactId;
  $scope.contact = userService.getUserById(username);
})

