angular.module('ionicApp.controllers', ['ionicApp.services'])

  .controller('LoginController', function($rootScope, $scope, $ionicPopup, $http, $state, userService) {
    $scope.user={
      username:"",
      password:""
    }
    $scope.signIn = function(user) {
      if(user.username==""||user.password==""){
        alert("用户名和密码不能为空");
        return;
      }
      $rootScope.ipAddress = "http://121.40.97.40:3000";
      var auth = window.btoa(user.username + ":" + user.password);
      console.log("base64 number : " + auth);
      auth = "Basic " + auth;
      console.log("authorization : " + auth);

      $rootScope.auth = auth
      $rootScope.userPassword = user.password;

      console.log("发送地址是 ： " + $scope.ipAddress + "/authentications/" + user.username)//user/check-password?username=" + user.username + "&password=" + user.password)
      $http.get($scope.ipAddress + "/authentications/" + user.username,{headers:{Authorization : auth}})
        .success(function (response, status, headers, config){
          if (status == 200){
            console.log("登陆成功");
            $state.go('menu.information');

            userService.setUsername(user.username, user.password, $scope.auth);

          }
        })
        .error(function (data, status, headers, config){
          if (status == 401){
            $ionicPopup.show({
              title: "用户名或密码错误",
              template: "请您确认后再次输入！",
              scope: $scope,
              buttons:[{
                text : "确定",
                type : "button-positive"
              }]
            }).then(function(res) {

            });
          }
         // alert("Login fail!");
          console.log("status : " + status);
          console.log("response : " + data.message);
        })
    };
  })

  .controller('MenuController', function ($scope, $state, $ionicPopup, userService) {
    $scope.user = userService.getUser();

    $scope.userPage = function () {
      $state.go('menu.userpage')
    }
  })

  .controller('PasswordController', function ($rootScope, $scope, $state, $ionicPopup, passwordService, userService) {
    $scope.password = {};
    $scope.id = userService.getUser().id;

    $scope.$on('$ionicView.beforeEnter',function () {
      $scope.password.oldPass = "";
      $scope.password.newPass = "";
      $scope.password.confirmPass = "";
    })

    $scope.changePassword = function () {
      if ($scope.password.oldPass == $scope.userPassword) {
        if ($scope.password.newPass == $scope.password.confirmPass) {
          passwordService.changePassword($scope.id, $scope.password.newPass,
            function () {
              $ionicPopup.show({
                title: "修改密码成功",
                template: "请您重新登陆！",
                scope: $scope,
                buttons:[{
                  text : "确定",
                  type : "button-positive"
                }]
              }).then(function (res) {
                $state.go('login');
              });
            },
            function () {
              $ionicPopup.show({
                title: "修改密码失败",
                template: "请您稍候重试！",
                scope: $scope,
                buttons:[{
                  text : "确定",
                  type : "button-positive"
                }]
              }).then(function (res) {
                //$state.go('login');
              });
            })
        }
        else{
          $ionicPopup.show({
            title: "确认密码错误",
            template: "请您确认后再次输入！",
            scope: $scope,
            buttons:[{
              text : "确定",
              type : "button-positive"
            }]
          }).then(function(res) {
            $scope.password.oldPass = "";
            $scope.password.newPass = "";
            $scope.password.confirmPass = "";
          });
        }
      }
      else{
        $ionicPopup.show({
          title: "原密码错误",
          template: "请您确认后再次输入！",
          scope: $scope,
          buttons:[{
            text : "确定",
            type : "button-positive"
          }]
        }).then(function(res) {
          $scope.password.oldPass = "";
          $scope.password.newPass = "";
          $scope.password.confirmPass = "";
        });
      }
    }
  })

  .controller('UserController', function ($scope, $state, $ionicPopup, userService) {
    $scope.user = userService.getUser();

    $scope.changePassword = function () {
      $state.go('menu.password');
    }

    $scope.logout = function () {
      $ionicPopup.show({
        title: "您确定要登出吗",
        scope: $scope,
        buttons:[
          {
            text : "确定",
            type : "button-positive",
            onTap: function(e) {
              $state.go('login');
            }
          },
          {
            text : "取消",
            type : "button-positive"
          }]
      }).then(function(res) {
      });
    }

    $scope.doRefresh=function() {
      $scope.user = userService.getUser();
      $scope.$broadcast('scroll.refreshComplete');
    }
  })

  .controller('ContactsController', function ($scope, $state, $http, userService) {
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

    $scope.showDetailContact = function (id) {
      $state.go('menu.single', {contactId : id});
    }

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
              if (response[i].name.indexOf(searchcontent) != -1||response[i].id.indexOf(searchcontent) != -1){
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

  .controller('InfoController', function ($scope, $state, $ionicModal, informationService, userService, modalService) {
    $scope.newInformation = function() {
      console.log("in new Information click");
      $scope.modal.show();
    }

    $scope.$on('$ionicView.beforeEnter', function(){
      informationService.getInformationList(function (response) {
        $scope.informations = response;
      })
    });

    $ionicModal.fromTemplateUrl('templates/newInformation.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modalService.setInformationModal(modal);
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

    $scope.calPortraitNumber = userService.calPortraitNumber;

    $scope.showDetailInformation = function (info) {
      $state.go('menu.detailInformation',{infoID :info.id});
    }
  })

  .controller('detailInformationController', function ($scope, $state, $stateParams, $ionicPopup, detailInformationService,userService) {
    $scope.infoID = $stateParams.infoID;
    $scope.images = [];
    $scope.a={};
    $scope.pictureSource = [];
    $scope.samePublisher = false;
    $scope.existed = false;
    $scope.calPortraitNumber = userService.calPortraitNumber;

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.images = [];
      $scope.pictureSource = [];
      $scope.samePublisher = false;
      detailInformationService.getInformation($scope.infoID, function(response){
        $scope.detailInfo = response;
        $scope.existed = true;
        $scope.a.textArray=$scope.detailInfo.text.split("\n");
        console.log("response id : " + response.publisher.id);
        console.log("user id : " + userService.getUserId());
        if (response.publisher.id == userService.getUserId())
          $scope.samePublisher = true;
        detailInformationService.getImages($scope.detailInfo, function (data, type) {
          console.log("以上是图片 类型 : " + type);
          var binaryData = [];
          binaryData.push(data);
          var blob = new Blob(binaryData,{type : type});
          console.log("接收图片大小" + blob.size)
          $scope.images.push(blob);
          var str = webkitURL.createObjectURL(blob);
          $scope.pictureSource.push(str);
        })
      }, function (response) {
        $ionicPopup.show({
          title: "该情报已被删除",
          scope: $scope,
          buttons:[{
            text : "确定",
            type : "button-positive"
          }]
        }).then(function (res) {
          $state.go('menu.information');
        });
      })
    })


    $scope.properTime = function(time){
      return (new Date(time)).toLocaleString();
    }

    $scope.deleteInformation = function () {
      detailInformationService.deleteInfo($scope.infoID);
      $state.go('menu.information');
    }

    $scope.responseInformation = function(){
      $state.go('menu.responseInformation', {responseInfoID : $scope.infoID});
    }
  })

  .controller('responseInformationController', function ($scope, $state, $stateParams, $ionicHistory,$ionicPopup, replicationServer, userService) {
    $scope.responseInfoID = $stateParams.responseInfoID;
    $scope.replication = replicationServer.replicationInstance();
    $scope.replication.replier = userService.getUser().id;

    $scope.responseInformation = function () {
      if ($scope.replication.content == ""){
        $ionicPopup.show({
          title: "回复内容不能为空",
          scope: $scope,
          buttons:[{
            text : "确定",
            type : "button-positive"
          }]
        }).then(function (res) {
          //do nothing
        });
      }
      else {
        replicationServer.sendReplication($scope.replication, $scope.responseInfoID,
          function () {
            $state.go('menu.detailInformation', {infoID: $scope.responseInfoID});
          },
          function () {
            $ionicPopup.show({
              title: "该情报已被删除",
              scope: $scope,
              buttons: [{
                text: "确定",
                type: "button-positive"
              }]
            }).then(function (res) {
              //$state.go('menu.information');
              $ionicHistory.goBack(-2);
          });
        });
      }
    }

  })

  .controller('newInformationController', function ($scope, $ionicActionSheet, $timeout, $state, $ionicPopup, userService, informationService, Camera, modalService) {
    $scope.information = informationService.informationInstance();
    $scope.information.publisher = userService.getUser().id;
    $scope.images = [];
    $scope.selectImage = false;

    $scope.closeModal = function () {
      $scope.information.text = "";
      $scope.information.images = [];
      $scope.information.urgent = false;
      $scope.images = [];
      $scope.modal = modalService.getInformationModal();
      $scope.modal.hide();
    }

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
        maximumImagesCount: 6,
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
        $scope.images.push(picUrl);
      }, function(err) {
      });

    }

    $scope.publishInformation = function () {
      if ($scope.information.text == ""){
        $ionicPopup.show({
          title: "情报内容不能为空",
          scope: $scope,
          buttons:[{
            text : "确定",
            type : "button-positive"
          }]
        }).then(function (res) {
          //do nothing
        });
        return;
      }
      $scope.information.images = $scope.images;
      informationService.sendInformation($scope.information, function (response) {
        $scope.information = response;
        informationService.sendImages(response, $scope.images);
        $scope.information.publisher = userService.getUser().id;
        $scope.information.text = "";
        $scope.information.images = [];
        $scope.information.urgent = false;
        $scope.images = [];
      });
      $scope.modal = modalService.getInformationModal();
      $scope.modal.hide();

    }
  })

  .controller('commandController', function ($scope, $state, commandService, $ionicModal,userService,modalService) {

    $scope.newCommand = function(){
      console.log("in new Command click");
      commandService.setReceiverListNull();
      $state.go('menu.newCommand');
     // $scope.modal.show();
    }
    /*
    $ionicModal.fromTemplateUrl('templates/newCommand.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modalService.setCommandModal(modal);
    });
   */
    $scope.calPortraitNumber = userService.calPortraitNumber;

    $scope.doRefresh = function(){
      commandService.getCommandList(function(response) {
        commandList = response
        commandService.changeDateStyle(commandList);
        commandService.setCommandList(commandList);
        $scope.commandList=commandList;
        if(commandList.length==0){
          $scope.isCommandListEmpty=true;
        }else{
          $scope.isCommandListEmpty=false;
        }
        $scope.$broadcast('scroll.refreshComplete');
      })

    }
    $scope.$on('$ionicView.beforeEnter',function(){
        commandService.getCommandList(function(response) {
          commandList = response
          commandService.changeDateStyle(commandList);
          commandService.setCommandList(commandList);
          $scope.commandList=commandList;
          if(commandList.length==0){
            $scope.isCommandListEmpty=true;
          }else{
            $scope.isCommandListEmpty=false;
          }
        })
      commandService.fillSendCommandList(function(response){
        $scope.sendCommandList=response;
        commandService.changeDateStyle($scope.sendCommandList);
      })
    }
    )
  })

  .controller('singleCommandController',function($scope,$stateParams,commandService, userService){
    var index= $stateParams.commandId;
    var command=commandService.getCommandByIndex(index);
    $scope.calPortraitNumber = userService.calPortraitNumber;
    $scope.command=command;
    //content=content.replace('\n', '<br>').replace('\t', '<br>').replace('\r', '<br>');//正确
    //console.log(content);
    $scope.contentArray=command.content.split("\n");
    console.log($scope.contentArray);
    console.log($scope.command.updated_time.toLocaleString());
    //$scope.command.content = content;
  })

  .controller('singleSendCommandController',function($scope,$stateParams,commandService, userService){
    var index= $stateParams.commandId;
    var command=commandService.getSendCommandByIndex(index);
    $scope.calPortraitNumber = userService.calPortraitNumber;
    $scope.command=command;
    //content=content.replace('\n', '<br>').replace('\t', '<br>').replace('\r', '<br>');//正确
    //console.log(content);
    $scope.contentArray=command.content.split("\n");
    console.log($scope.contentArray);
    console.log($scope.command.updated_time.toLocaleString());
  })

  .controller('newCommandController',function($scope,$state,$ionicHistory, $ionicPopup,commandService) {

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
    /*
    $scope.closeModal = function () {
      $scope.a.content="";
      $scope.modal = modalService.getCommandModal();
      $scope.modal.hide();
    }*/
     $scope.sendCommand = function (content) {
     //sendcommand = command;
     //sendcommand.sender = "mymy";
       for (var ii=0;ii<$scope.receiverList.length;ii++) {
         console.log("aaaaaan updateReceiver,after ger receiverList" + $scope.receiverList[ii].id);
       }
       if($scope.receiverList.length==0) {
           $ionicPopup.show({
             title: "命令接收者不能为空",
             scope: $scope,
             buttons:[{
               text : "确定",
               type : "button-positive"
             }]
           }).then(function (res) {
             //do nothing
           });
           return;
       }
       if(content==""){
         $ionicPopup.show({
           title: "命令内容不能为空",
           scope: $scope,
           buttons:[{
             text : "确定",
             type : "button-positive"
           }]
         }).then(function (res) {
           //do nothing
         });
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
    $scope.changeChoose=function (group) {
      console.log("全选  "+group.name);
      for (var i in group.items){
        group.items[i].ischecked=group.ischecked;
      }

    }
    $scope.changeGroupChoose=function(group,ischecked){
      if(ischecked==false){
        group.ischecked=false;
      }else{
        flag=true;
        for (var i in group.items){
          if(group.items[i].ischecked==false)
            flag=false;
        }
        if(flag==true)         group.ischecked=true;

      }
    }

    $scope.$on('$ionicView.beforeEnter',function(){
      //根据联系人列表设置联系人的选中与否
     // commandService.updateCheckedbyReceiverList();
      //$scope.groups=commandService.getGroups();
     // commandService.changeGroupsChecked($scope.groups);
      for(var i in $scope.groups){
        for(var j in $scope.groups[i].items){
          console.log("after update"+$scope.groups[i].items[j].name+$scope.groups[i].items[j].ischecked);
        }
      }
    })
    commandService.fillGroups(function(){});
    $scope.groups=commandService.getGroups();
   // commandService.updateCheckedbyReceiverList();

    function objMerger(obj1, obj2)
    {
      for(var r in obj2){
        eval("obj1."+r+"=obj2."+r);
      }
      return obj1;
    }

    $scope.toggleGroup = function(group) {
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
      if (searchcontent == '') {
        $scope.searchisnull = true;
        commandService.changeGroupsChecked($scope.groups);
      }
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
      commandService.fillGroups(function(){
        $scope.$broadcast('scroll.refreshComplete');
      });
      $scope.groups=commandService.getGroups();
    }

  })

  .controller('DocumentController', function ($scope,documentService) {
    $scope.MainClassArray=documentService.getMainclass();
  })

  .controller('DocumentSubClassController', function ($scope, $state, $stateParams, documentService) {
    var name=$stateParams.classname;
    $scope.classname=name;
    $scope.subclass=documentService.getSubclassByIndex(name);

    $scope.showSubClassItems = function (item) {
      console.log("subclass name : " + item);
      $state.go('menu.documentSubclassItem',{classname : $scope.classname,subclassname : item})
    }
  })

  .controller('DocumentSubClassItemController',function($scope, $state, $stateParams, documentService){
    $scope.classname = $stateParams.classname;
    $scope.subclass = $stateParams.subclassname;

    $scope.$on('$ionicView.beforeEnter', function () {
      console.log("大类名：" + $scope.classname)
      console.log("小类名：" + $scope.subclass)
      documentService.getDocument($scope.classname, $scope.subclass, function (response) {
        $scope.document = response;
      })
    })

    $scope.showDetailDocument = function (doc) {
      console.log(doc.title + "------")
      documentService.setDocument(doc);
      $state.go('menu.detailDocument',{classname : $scope.classname,subclassname : $scope.subclass, index : 1});
    }
  })

  .controller('detailDocumentController',function($scope, $stateParams, documentService){
    $scope.classname = $stateParams.classname;
    $scope.subclass = $stateParams.subclassname;
    $scope.index = $stateParams.index;

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.images = [];
      $scope.document = documentService.getDetailDocument();
      documentService.getDocumentImages($scope.document, function (data, type) {
        console.log("文档：以上是图片 type : " + type);
        var binaryData = [];
        binaryData.push(data);
        var blob = new Blob(binaryData,{type : type});
        console.log("文档：接收图片大小" + blob.size)
        var str = webkitURL.createObjectURL(blob);
        $scope.images.push(str);
      })

      $scope.contentArray=$scope.document.text.split("\n");
    })
  })
