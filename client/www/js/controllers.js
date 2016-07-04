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
    $scope.doRefresh=function() {
      $scope.user = userService.getUser();
      $scope.$broadcast('scroll.refreshComplete');
    }
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
    $scope.doRefresh=function(){
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
      //      $scope.toggleGroup($scope.groups[i]);
            $scope.$broadcast('scroll.refreshComplete');
          }

        })
        .error(function (response) {
          alert("Fail to get the regions");
          console.log("app ConstactsController Fail to get regions --- error message : ", response.error);
        })

    }

  })

  .controller('ContactController', function ($scope,$stateParams, userService) {
    var username = $stateParams.contactId;
    userService.getUserById(username, function (response) {
      $scope.contact = response;
    });
  })

  .controller('InfoController', function ($scope, $state) {
    $scope.newInformation = function() {
      console.log("in new Information click");
      $state.go('menu.newInformation');
    }

    $scope.informations = [];
    $scope.informations[0] = {
      id: 1,
      publisher:"txp",
      text: "This is a \"Facebook\" styled Card. The header is created from a Thumbnail List item,the content is from a card-body consisting of an image and paragraph text. The footerconsists of tabs, icons aligned left, within the card-footer.",
      images:[{path : "img/txp2.png"}],
      urgent: true,
      replications: [],
      time: "2016-06-22"
    }

    $scope.informations[1] = {
      id: 1,
      publisher:"txp",
      text: "This is a \"Facebook\" styled Card. The header is created from a Thumbnail List item,the content is from a card-body consisting of an image and paragraph text. The footerconsists of tabs, icons aligned left, within the card-footer.",
      images:[{path : "img/txp2.png"}],
      urgent: true,
      replications: [],
      time: "2016-06-22"
    }

    $scope.properTime = function (time) {
      return time;
    }

    $scope.properContent = function (text) {
      var num = 10 * 2;
      var i = num;
      for (i = num;i < text.length;i++){
        if (text[i] == ' ')
          break;
        if (i == 30)
          break;
      }
      var content = text.substring(0,i);
      content = content.concat("... ");
      return content;
    }
  })

  .controller('newInformationController', function ($scope, $ionicActionSheet) {
    $scope.showPictureChoice = function () {
      var hideSheet = $ionicActionSheet.show({
        buttons:[
          { text: '<b>拍照</b>'},
          { text: '从<b>相册</b>中选择'}],
        tittleText: '上传图片',
        cancelText: '取消',
        cancel: function () {
          //do nothing just cancel
        },
        buttonClicked: function (index) {
          if (index == 0){
            //do nothing
          }
          if (index == 1){
            $scope.readAlbum();
          }
        }
      })
    }

    $scope.readAlbum = function () {
      if (!window.imagePicker) {
        alert('您的环境不支持相册上传');
        return;
      }

      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
      };

      $cordovaImagePicker.getPictures(options).then(function (result) {
        var uri = result[0];
        var name = uri;
        alert("app-information-newInformation-picture uri : " + uri);
        if (name.indexOf('/')){
          var i = name.lastIndexOf('/');
          name = name.substring(i + 1);
        }
      }, function (error) {
        alert(error);
      });
    }
  })

  .controller('commandController', function ($scope,$state) {

    $scope.newCommand = function(){
      console.log("in new Command click");
      $state.go('menu.newCommand');
    }
    $scope.commandList=[];
    $scope.commandList[0]={
      id:0,
      sender: 'dwc',
      receiver: 'txp',
      img:'img/dwc.jpg',
      content:"我马上要去你办公室，请准备好迎接",
      time:"2016-06-23"
    }
    $scope.commandList[1]={
      id:1,
      sender:'yyt',
      receiver:'txp',
      img:'img/yyt.jpg',
      content:"你还是要提高一下自己的姿势水平",
      time:"2016-06-24"
    }
  })

  .controller('singleCommandController',function($scope){
    console.log("in singleCommandController")
  })

  .controller('newCommandController',function($scope){

})

