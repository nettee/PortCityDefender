var app = angular.module('ionicApp.services',[])

var ipAddress = "http://121.40.97.40:3000"//"http://localhost:3000"//"http://121.40.97.40:3000"

app.factory('userService', function($http){
  /**A user contains 6 properties
   * id : string
   * name : string
   * level : int
   * region : string
   * description : string
   * phone : string
   * */

  function newuser(id, name, level, region, description, phone) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.region = region;
    this.description = description;
    this.phone = phone;
  }

  function regionuser(id, name, level) {
    this.id = id;
    this.name = name;
    this.level = level;
  }

  var user = {
    id : "txp",
    name : "陶先平",
    level : 2,
    region : "south",
    description : "后勤部部长",
    phone : "123",
  }

  var fillUser = function (id) {
    $http.get(ipAddress + "/users?id=" + id)
      .success(function (response) {
        response = response[0];
        user.name = response.name;
        user.level = response.level;
        user.region = response.region;
        user.description = response.description;
        user.phone = response.phone;
        console.log("app userService method-fillUser Success ");
      })
      .error(function (response) {
        alert("Fail to get the user by id : " + id);
        console.log("app userService method-fillUser Fail to get---error message : ", response.error);
      })
  }


  var getUserById = function (id, callback) {
    $http.get(ipAddress + "/users?id=" + id)
      .success(function (response) {
        response = response[0];
        callback(response);
      })
      .error(function (response) {
        alert("Fail to get the user by id : " + id);
        console.log("app userService method-getUserFromId Fail to get---error message : ", response.error);
      })
  }

  return {
    getUser : function () {
      return user;
    },

    getUserById : getUserById,

    setUsername : function(id){
      user.id = id;
      fillUser(id);
    }
  };
});

app.factory('commandService',function($http,userService){

  var commandList =[]
  var mygroups=[]
  var receiverList=[]
  var draftCommand={
    sender: 'mymy',
    receiver:'default' ,
    content: 'default content'
}
  /*
  commandList[0]={
    id:0,
    sender: 'dwc',
    receiver: 'txp',
    img:'img/dwc.jpg',
    content:"我马上要去你办公室，请准备好迎接",
    time:"2016-06-23"
  }
  commandList[1]={
    id:1,
    sender:'yyt',
    receiver:'txp',
    img:'img/yyt.jpg',
    content:"你还是要提高一下自己的姿势水平",
    time:"2016-06-24"
  }*/

  var changeDateStyle=function(commandList){
    for(var i in commandList){
      var command=commandList[i];
      var updated_time=new Date(command.updated_time);
      command.updated_time=updated_time.toLocaleString();
    }
  }
  var fillCommand=function(callback)
  {
    $http.get(ipAddress + "/commands?receiver=" + userService.getUser().id)
      .success(function (response) {
       // commandList = response;
        for (var i in response){
          console.log("commandList response"+response[i].updated_time);
        }
        callback(response);
      })
      .error(function () {
        alert("get command List failed");
      })
  }
  /*
  receiverList[0]={
    id:null,
    name:null
  }*/
  var setmyReceiverList=function(){
    receiverList=[];
    for(var i=0;i<mygroups.length;i++){
     // console.log("hahha"+mygroups[i])
      for (var j=0;j<mygroups[i].items.length;j++){
        //  console.log(mygroups[i].items[j]);
           if(mygroups[i].items[j].ischecked == true){
              var receiver={
                id:mygroups[i].items[j].id,
                name:mygroups[i].items[j].name
              }
             receiverList.push(receiver);
           }
      }
    }
  }

  var setAllContactsNotChoose=function() {
    for (var i = 0; i < mygroups.length; i++) {
      // console.log("hahha"+mygroups[i])
      for (var j = 0; j < mygroups[i].items.length; j++) {
        mygroups[i].items[j].ischecked=false;
      }
    }
  }

  return {
    getCommandList:function(callback){
      fillCommand(callback);
     // console.log("get Command List"+commandList);
    },
    setCommandList:function(CommandList){
      commandList=CommandList;
    },
    getCommandByIndex:function(index){
     // console.log(index);
      console.log("in get command by index   "+commandList.length);
      return  commandList[index];
    },
    getGroups:function(){
      return mygroups;
    },
    updateGroups:function(group,i){
      mygroups[i]=group;
    },
    updateReceiver:function(groups){
      mygroups=groups;
     // console.log("in updateReceiver,before ger receiverList"+groups[0].items[0].ischecked);
      setmyReceiverList();
      for (var ii=0;ii<receiverList.length;ii++) {
        console.log("hhhhhin updateReceiver,after ger receiverList" + receiverList[ii].name);
      }
    },
    getReceiverList:function(){
      //for (var ii=0;ii<receiverList.length;ii++) {
        //console.log("in updateReceiver,after ger receiverList" + receiverList[ii].name);
      //}
      return receiverList;
    },
    sendCommand: function(ReceiverList,content){
      myid=userService.getUser().id;
      console.log("in send command"+content);
      if(content !="") {
        command = [];
        for (var i in ReceiverList) {
          console.log("in send command" + ReceiverList[i].name);
          command[i] = {
            receiver: ReceiverList[i].id,
            sender: myid,
            content: content
          }

          console.log("in send command" + command[i].receiver + "  " + command[i].sender + "  " + command[i].content);
          $http.post(ipAddress + "/commands", command[i])

            .success(function (response) {
              console.log(response.updated_time);

            })
            .error(function (response) {
              alert("send failed")
            })

        }
      }
      receiverList=[];
      setAllContactsNotChoose();
      console.log("cleaning finished")
    },
    changeDateStyle: function(commandList) {
      changeDateStyle(commandList);
    }
  }
});

app.factory('informationService', function ($http) {
  var user = {
    id : "",
    name : "",
    level : 1,
    region : "",
    description : "",
    phone : "",
  }

  var infoExample = {
    id: 1,
    publisher: user,
    text: "",
    images:[],
    urgent: false,
    replications: [],
    updated_time: ""
  };

  function sendInformation(information, callback){
    var publishinfo = {
      publisher: "",
      text: "",
      urgent: false
    }

    publishinfo.text = information.text;
    publishinfo.publisher = information.publisher;
    publishinfo.urgent = information.urgent;

    $http({
      method : "POST",
      url : ipAddress + "/information",
      data : publishinfo
    }).success(function (response) {
      console.log(response.publisher.name + " succeed in sending information to serve at time : " + response.updated_time);
      callback(response);
    }).error(function (response) {
      console.log("Fail to send information to server");
    });
  }

  function sendImages(information, images) {
    for (var i in images){
      var picUrl = images[i];
      var str = picUrl.split(".");
      var type = str[str.length - 1];
      var s = "image/";

      if (type[0] == 'j')
        s += "jpeg";
      if (type[0] == 'p')
        s += "png";

      var xhr = new XMLHttpRequest();
      xhr.open("get", picUrl, true);
      xhr.responseType = "blob";
      xhr.onload = function() {

        if (this.status == 200) {
          var blob = this.response;
          console.log(blob.size);
         // alert(blob.size);
          $http({
            method : "POST",
            url : ipAddress + "/information/" + information.id + "/images",
            data : blob,
            headers : {
              'Content-Type' : s,
              'Content-Length' : blob.size
            }
          }).success(function (response) {
            information.images[i] = response;

            console.log("发送图片成功");
          }).error(function (error) {
            alert("发送图片失败")
            console.log("发送图片失败");
          })
        }
        else{
          if (this.status == 0){
            var blob = this.response;
            console.log(blob.size);

            $http({
              method : "POST",
              url : ipAddress + "/information/" + information.id + "/images",
              data : blob,
              headers : {
                'Content-Type' : s,
                'Content-Length' : blob.size
              }
            }).success(function (response) {
              information.images[i] = response;

              console.log("发送图片成功");
            }).error(function (error) {

              console.log("发送图片失败");
            })
          }
          else {
            alert("发送本地失败")
            console.log("失败");
          }
        }
      }
      xhr.send();
    }
  }

  function getInformationList(callback){
    $http({
      method : "GET",
      url : ipAddress + "/information"
    }).success(function (response) {
      console.log("Get information list from server");
      callback(response);
    }).error(function (response) {
      console.log("Gail to get information list from server");
    })
  }

  return {
    informationInstance : function(){
      infoExample.text = "";
      infoExample.images = [];
      infoExample.urgent = false;
      return infoExample;
    },
    sendInformation : sendInformation,
    sendImages : sendImages,
    getInformationList : getInformationList
  };

});

app.factory('detailInformationService', function ($http) {

  function getInformation(infoID, callback){
    $http({
      method : "GET",
      url : ipAddress + "/information/" + infoID
    }).success(function (data, status, headers, config) {
      console.log("成功获取详细信息");
      callback(data);
    }).error(function (data, status, headers, config) {
      console.log("获取详细信息失败");
    })
  }

  function getImages(information, callback){
    var images = information.images;
    for (var i in images){
      $http({
        method : "GET",
        url : ipAddress + "/images/" + images[i].id,
        responseType: 'arraybuffer'
      }).success(function (data, status, headers, config) {
        console.log("成功获取图片（根据ID）");
        callback(data);
      }).error(function (response) {
        console.log("获取图片失败（根据ID）");
      })
    }
  }

  function deleteInfo(infoID){
    $http({
      method : "DELETE",
      url : ipAddress + "/information/" + infoID
    }).success(function (data, status, headers, config) {
      console.log("成功删除情报");
    }).error(function (data, status,headers, config) {
      console.log("删除情报失败");
    })
  }

  return {
    getImages : getImages,
    getInformation : getInformation,
    deleteInfo : deleteInfo
  }
});
