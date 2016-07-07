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

  .controller('newInformationController', function ($scope, $ionicActionSheet, $timeout, userService, informationService) {
    $scope.information = informationService.informationInstance;

    $scope.showPictureChoice = function () {
      var hideSheet = $ionicActionSheet.show({
        buttons:[
          { text: '<b>拍照</b>'},
          { text: '从<b>相册</b>中选择'}],
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

      $timeout(function() {
        hideSheet();
      }, 3000);
    }

    $scope.readAlbum = function () {

      if (!window.imagePicker) {
        alert('您的环境不支持相册上传');
        return;
      }

      var options = {
        maximumImagesCount: 2,
        width: 800,
        height: 800,
        quality: 80
      };

      imagePicker.getPictures(function (result) {
        $scope.selectImage = true;
        for (var i in result){
          $scope.images.push(result[i]);
        }
      }, function (error) {
        alert(error);
      }, options);
    }
    $scope.images = [];
    $scope.selectImage = false;
  })

  .controller('commandController', function ($scope,$state,commandService) {

    $scope.newCommand = function(){
      console.log("in new Command click");
      $state.go('menu.newCommand');
    }
    $scope.$on('$ionicView.beforeEnter',function(){
        commandService.getCommandList(function(response){
      $scope.commandList=response;
      commandService.setCommandList($scope.commandList);
      })
    }
    )
  })

  .controller('singleCommandController',function($scope,$stateParams,commandService){
    var index= $stateParams.commandId;
    $scope. command=commandService.getCommandByIndex(index);
  })
 .controller('newCommandController',function($scope,$state,$ionicHistory,commandService) {
   var sendcommand = {};
   $scope.receiverList=commandService.getReceiverList();
   //console.log("in newCommand controller  "+$scope.receiverList.length);
   //for (var receiver in $scope.receiverList) {
   //  console.log(receiver.name);
   //}
   $scope.$on('$ionicView.beforeEnter',function(){
     $scope.receiverList=commandService.getReceiverList();
   })
   $scope.doRefresh=function() {
     $scope.receiverList=commandService.getReceiverList();
     $scope.$broadcast('scroll.refreshComplete');
   }
     $scope.sendCommand = function (content) {
     //sendcommand = command;
     //sendcommand.sender = "mymy";
       for (var ii=0;ii<$scope.receiverList.length;ii++) {
         console.log("aaaaaan updateReceiver,after ger receiverList" + $scope.receiverList[ii].id);
       }
       commandService.sendCommand($scope.receiverList,content);
     //记得收件人信息均为userl类型，需要实现一个获取自己的函数，需要实现一个发送的函数，状态转换包装为回调函数传入
     //实现的回调函数中注意传进去的是一个command.receiverList
       $ionicHistory.goBack(-2);
     }
   $scope.chooseReceiver = function () {
    // console.log("into chooseReceiver")
     $state.go('menu.commandReceiver')
   }
 })
  .controller('commandReceiverController',function($scope,$http,$state,$ionicHistory,commandService){
    console.log("into commandReceiverController")
    $scope.updateReceiver=function(groups){
      commandService.updateReceiver(groups);
    //  $ionicHistory.goBack();
      $state.go('menu.newCommand',{},{reload:true});
    }
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
        $scope.toggleGroup($scope.groups);
      })
      .error(function (response) {
        alert("Fail to get the regions");
        console.log("app ConstactsController Fail to get regions --- error message : ", response.error);
      })
    function objMerger(obj1, obj2)
    {
      for(var r in obj2){
        eval("obj1."+r+"=obj2."+r);
      }
      return obj1;
    }
    $scope.toggleGroup = function(group) {
      if (group.isfill == false){
        $http.get("http://121.40.97.40:3000/users?region=" + group.name)
          .success(function (response) {
            var i = regionlist.indexOf(group.name);
            for (var j = 0;j < response.length;j++){
              $scope.groups[i].items.push(response[j]);
              var check={ischecked:false};
              $scope.groups[i].items[j]=objMerger($scope.groups[i].items[j],check);
            }
            $scope.groups[i].isfill = true;
            group.show = !group.show;
            commandService.updateGroups(group,i);
          })
          .error(function (response) {
            alert("Fail to get the users by region : " + regionlist[i]);
            console.log("app userService method-getUserByRegion Fail to get---error message : ", response.error);
          })
      }else {
        group.show = !group.show;
      }
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

        groups=commandService.getGroups();
        console.log("heheheh"+groups);
        for(var i in groups) {
          console.log("hehehhehe"+groups[i].items);
          group=groups[i].items;
          for (var j in group) {
            console.log("he"+group[j].name);
            if (group[j].name.indexOf(searchcontent) != -1||group[j].id.indexOf(searchcontent) != -1) {
              $scope.searchResults.push(group[j]);
            }
          }
        }
        $scope.searchisnull=false;

        /*
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
        */
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
         // alert("Fail to get the regions");
          console.log("app ConstactsController Fail to get regions --- error message : ", response.error);
        })

    }

  })

