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

.controller('ContactlistsCtrl', function($scope,$http) {
      $http.get("http://121.40.97.40:3000/users")
      .success(function (response){
        $scope.contactlists=response;
             })
      .error(function (){
        alert("Login fail!");
        console.log("Login : Fail to send the get request");
      })
})

.controller('ContactCtrl', function($scope, $stateParams) {
});