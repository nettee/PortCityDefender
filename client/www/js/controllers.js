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
    var regionlist = [];
    $scope.groups = [];

    $http.get("http://121.40.97.40:3000/regions")
      .success(function (response) {
        regionlist = response;
        for (var i = 0; i < regionlist.length; i++) {
          $scope.groups[i] = {
            name: regionlist[i],
            items: [],
            show: false,
            isfill: false
          };
        }
      })
      .error(function (response) {
        alert("Fail to get the regions");
        console.log("app ConstactsController Fail to get regions --- error message : ", response.error);
      })

    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function(group) {
      if (group.isfill == false){
        $http.get("http://121.40.97.40:3000/users?region=" + group.name)
          .success(function (response) {
            var i = regionlist.indexOf(group.name);
            for (var j = 0;j < response.length;j++){
              $scope.groups[i].items.push(response[j]);
            }
            $scope.groups[i].isfill = true;
          })
          .error(function (response) {
            alert("Fail to get the users by region : " + regionlist[i]);
            console.log("app userService method-getUserByRegion Fail to get---error message : ", response.error);
          })
      }
      group.show = !group.show;
    };
    $scope.isGroupShown = function(group) {
      return group.show;
    };

    /**
     * Below is the search
     */
    $scope.searchisnull = true;
    $scope.searchResults = [];
    $scope.search = function (searchcontent) {
      if (searchcontent == '')
        $scope.searchisnull = true;
      else {
        $scope.searchResults.splice(0,$scope.searchResults.length);
        $http.get("http://121.40.97.40:3000/users")
          .success(function (response) {
            for (var i in response){
              if (response[i].name.indexOf(searchcontent) != -1){
                $scope.searchResults.push(response[i]);
              }
            }
          })
          .error(function (response) {
            alert("Fail to get the users" + region);
            console.log("app userService method-filter Fail to get---error message : ", response.error);
          })
        $scope.searchisnull = false;
      }
    }
  })

  .controller('ContactController', function ($scope,$stateParams, userService) {
    var username = $stateParams.contactId;
    userService.getUserById(username, function (response) {
      $scope.contact = response;
    });
  })

