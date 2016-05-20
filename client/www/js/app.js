angular.module('ionicApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
    })
    .state('userpage', {
      url: '/user-page',
      templateUrl: 'templates/user-page.html'
    })

   $urlRouterProvider.otherwise('/sign-in');

})

.controller('SignInCtrl', function($scope, $http, $state) {
  
  $scope.signIn = function(user) {
    $http.get("http://121.40.97.40:3000/user/check-password?username=" + user.username + "&password=" + user.password).success(function (response){
    	console.log(response.status);
    	if (response.status === "pass"){
    		$state.go('userpage');
    	}
    	else
    		alert("用户名或密码错误！");
    })
    .error(function (){
    	alert("fail")
	})
    
  };
  
})
