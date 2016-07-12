angular.module('ionicApp.controllers', ['ionicApp.services'])

  .controller('LoginController', function($rootScope, $scope, $http, $state, userService) {
    $scope.signIn = function(user) {
      $rootScope.ipAddress = "http://121.40.97.40:3000";
      var auth = window.btoa(user.username + ":" + user.password);
      console.log("base64 number : " + auth);
      auth = "Basic " + auth;
      console.log("authorization : " + auth);

      $rootScope.auth = auth
      
      console.log("发送地址是 ： " + $scope.ipAddress + "/authentications/" + user.username)//user/check-password?username=" + user.username + "&password=" + user.password)
      $http.get($scope.ipAddress + "/authentications/" + user.username,{headers:{Authorization : auth}})
        .success(function (response, status, headers, config){
          if (status == 200){
            console.log("登陆成功");
            $state.go('menu.firstpage');
            userService.setUsername(user.username,$scope.auth);
          }
          else
            alert("用户名或密码错误!");
        })
        .error(function (data, status, headers, config){
          alert("Login fail!");
          console.log("status : " + status);
          console.log("response : " + data.message);
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

    $http.get($scope.ipAddress + "/regions",{headers:{Authorization : $scope.auth}})
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
        $http.get($scope.ipAddress + "/users?region=" + group.name,{headers:{Authorization : $scope.auth}})
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
        $http.get($scope.ipAddress + "/users",{headers:{Authorization : $scope.auth}})
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

      $http.get($scope.ipAddress + "/regions",{headers:{Authorization : $scope.auth}})
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

  .controller('InfoController', function ($scope, $state, informationService) {
    $scope.newInformation = function() {
      console.log("in new Information click");
      $state.go('menu.newInformation');
    }

    $scope.$on('$ionicView.beforeEnter', function(){
      informationService.getInformationList(function (response) {
        $scope.informations = response;
      })
    });

    $scope.properTime = function (time) {
      var date = new Date(time);
      return date.toLocaleString()
    }

    $scope.properContent = function (text) {
      if (text.length <= 40)
        return text;

      var num = 10 * 2;
      var i = num;
      for (i = num;i < text.length;i++){
        if (text[i] == ' ')
          break;
        if (i == 40)
          break;
      }
      var content = text.substring(0,i);
      content = content.concat("... ");
      return content;
    }

    $scope.doRefresh=function(){
      informationService.getInformationList(function (response) {
        $scope.informations = response;
        $scope.$broadcast('scroll.refreshComplete');
      })
    }

    $scope.showDetailInformation = function (info) {
      $state.go('menu.detailInformation',{infoID :info.id});
    }
  })

  .controller('detailInformationController', function ($scope, $state, $stateParams, detailInformationService,userService) {
    $scope.infoID = $stateParams.infoID;
    $scope.images = [];
    $scope.pictureSource = [];
    $scope.samePublisher = false;

    detailInformationService.getInformation($scope.infoID, function(response){
      $scope.detailInfo = response;
      console.log("response id : " + response.publisher.id);
      console.log("user id : " + userService.UserId);
      if (response.publisher.id == userService.UserId)
        $scope.samePublisher = true;
      detailInformationService.getImages($scope.detailInfo, function (data) {
        console.log("以上是图片");
        var binaryData = [];
        binaryData.push(data);
        var blob = new Blob(binaryData,{type : "image/png"});
        console.log("接收图片大小" + blob.size)
        $scope.images.push(blob);
        var str = webkitURL.createObjectURL(blob);
        $scope.pictureSource.push(str);
      })
    })

    $scope.properTime = function(time){
      return (new Date(time)).toLocaleString();
    }

    $scope.deleteInformation = function () {
      detailInformationService.deleteInfo($scope.infoID);
      $state.go('menu.information');
    }
  })

  .controller('newInformationController', function ($scope, $ionicActionSheet, $timeout, $state, userService, informationService, Camera) {
    $scope.information = informationService.informationInstance();
    $scope.information.publisher = userService.getUser().id;
    $scope.images = [];
    $scope.selectImage = false;

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
            $scope.takePicture();
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
        for (var i in result){
          $scope.images.push(result[i]);
        }
      }, function (error) {
        alert(error);
      }, options);
    }

    $scope.takePicture = function() {
      if (!navigator.camera) {
        alert('请在真机环境中使用拍照上传。')
        return;
      }

      var options = {
        quality: 75,
        targetWidth: 800,
        targetHeight: 800,
        saveToPhotoAlbum: false
      };

      Camera.getPicture(options).then(function(picUrl) {
        alert(picUrl);
        $scope.images.push(picUrl);
      }, function(err) {
        //alert("拍照错误：" + err);
      });

    }

    $scope.publishInformation = function () {
      if ($scope.information.text == ""){
        alert("情报内容不能为空！");
        return;
      }
      $scope.information.images = $scope.images;
      informationService.sendInformation($scope.information, function (response) {
        $scope.information = response;
        informationService.sendImages(response, $scope.images);
      });
      $state.go('menu.information');
    }
  })

  .controller('commandController', function ($scope,$state,commandService) {

    $scope.newCommand = function(){
      console.log("in new Command click");
      commandService.setReceiverListNull();
      $state.go('menu.newCommand');
    }
    $scope.doRefresh = function(){
      commandService.getCommandList(function(response) {
        commandList = response
        commandService.changeDateStyle(commandList);
        commandService.setCommandList(commandList);
        $scope.commandList=commandList;
        $scope.$broadcast('scroll.refreshComplete');
      })

    }
    $scope.$on('$ionicView.beforeEnter',function(){
        commandService.getCommandList(function(response) {
          commandList = response
          commandService.changeDateStyle(commandList);
          commandService.setCommandList(commandList);
          $scope.commandList=commandList;
        })
    }
    )
  })

  .controller('singleCommandController',function($scope,$stateParams,commandService){
    var index= $stateParams.commandId;
    var command=commandService.getCommandByIndex(index);
    $scope.command=command;
    //content=content.replace('\n', '<br>').replace('\t', '<br>').replace('\r', '<br>');//正确
    //console.log(content);
    $scope.contentArray=command.content.split("\n");
    console.log($scope.contentArray);
    console.log($scope.command.updated_time.toLocaleString());
    //$scope.command.content = content;
  })

  .controller('newCommandController',function($scope,$state,$ionicHistory,commandService) {

   var sendcommand = {};
    $scope.a={content:""};
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
       if($scope.receiverList.length==0) {
         alert("接收者不能为空！");
         return;
       }
       if(content==""){
         alert("内容不能为空！");
         return;
       }
       console.log("shshshshs"+content)
       commandService.sendCommand($scope.receiverList,content);
     //记得收件人信息均为userl类型，需要实现一个获取自己的函数，需要实现一个发送的函数，状态转换包装为回调函数传入
     //实现的回调函数中注意传进去的是一个command.receiverList
       $state.go('menu.command');
       //$ionicHistory.goBack(-2);
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
    $scope.$on('$ionicView.beforeEnter',function(){
      //根据联系人列表设置联系人的选中与否
      commandService.updateCheckedbyReceiverList();
      $scope.groups=commandService.getGroups();
    })
    var regionlist = [];
    //$scope.groups = [];

    $http.get($scope.ipAddress + "/regions",{headers:{Authorization : $scope.auth}})
      .success(function (response) {
        regionlist = response;
        for (var i = 0; i < regionlist.length; i++) {
          $scope.groups[i] = {
            name: regionlist[i],
            items: [],
            show: false,
            isfill: false
          };
          fillGroup($scope.groups[i]);
        }
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
    function fillGroup(group)
    {
      if (group.isfill == false){
        $http.get($scope.ipAddress + "/users?region=" + group.name,{headers:{Authorization : $scope.auth}})
          .success(function (response) {
            var i = regionlist.indexOf(group.name);
            for (var j = 0;j < response.length;j++){
              $scope.groups[i].items.push(response[j]);
              var check={ischecked:false};
              $scope.groups[i].items[j]=objMerger($scope.groups[i].items[j],check);
            }
            $scope.groups[i].isfill = true;
            group.show = !group.show;
            commandService.updateGroups( group,i);
          })
          .error(function (response) {
            alert("Fail to get the users by region : " + regionlist[i]);
            console.log("app userService method-getUserByRegion Fail to get---error message : ", response.error);
          })
      }
    }
    $scope.toggleGroup = function(group) {
      if (group.isfill == false){
        $http.get($scope.ipAddress + "/users?region=" + group.name,{headers:{Authorization : $scope.auth}})
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

      }
    }
    $scope.doRefresh=function(){
      var regionlist = [];
      $scope.groups = [];

      $http.get($scope.ipAddress + "/regions",{headers:{Authorization : $scope.auth}})
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

