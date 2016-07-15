var app = angular.module('ionicApp.services',[])

var ipAddress = "http://121.40.97.40:3000"//"http://localhost:3000"//"http://121.40.97.40:3000"
var auth = "";
var password = ""

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

  var user = {}

  var fillUser = function (id, pass, authnum) {
    auth = authnum;
    password = pass;
    $http.get(ipAddress + "/users?id=" + id,{headers:{Authorization : auth}})
      .success(function (response) {
        response = response[0];
        user.id = response.id;
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
    console.log("发送地址是 ： " + ipAddress + "/users?id=" + id);
    $http.get(ipAddress + "/users?id=" + id,{headers:{Authorization : auth}})
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

    setUsername : function(id, password, auth){
      user.id = id;
      fillUser(id, password, auth);
    },

    getUserId : function () {
      return user.id;
    }
  };
});

app.factory('commandService',function($http,userService){

  var commandList =[]
  var mygroups=[]
  var receiverList=[]
 //var mygroupsIsfill=false;
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
    $http.get(ipAddress + "/commands?receiver=" + userService.getUser().id,{headers:{Authorization : auth}})
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

  var setReceiverListNull=function() {
    receiverList=[];
    setAllContactsNotChoose();
  }

  var updateCheckedbyReceiverList = function(){
    for (var i = 0; i < mygroups.length; i++) {
      // console.log("hahha"+mygroups[i])
      for (var j = 0; j < mygroups[i].items.length; j++) {
        mygroups[i].items[j].ischecked=false;
        for(var a in receiverList){
          if(mygroups[i].items[j].id.indexOf(receiverList[a].id)!=-1){
            mygroups[i].items[j].ischecked=true;
          }
        }
        console.log("see checked"+mygroups[i].items[j].name+" "+mygroups[i].items[j].ischecked);
      }
    }
  }

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
      console.log("into fillgroup");
      $http.get(ipAddress + "/users?region=" + group.name,{headers:{Authorization : auth}})
        .success(function (response) {
          var i = regionlist.indexOf(group.name);
          for (var j = 0;j < response.length;j++){
            m=0;
            if(response[j].level==userService.getUser().level+1){
              mygroups[i].items.push(response[j]);
              var check={ischecked:false};
              mygroups[i].items[m].ischecked=false;
              m=m+1;
            }
          }
          mygroups[i].isfill = true;
          group.show = !group.show;
          updateCheckedbyReceiverList();
        })
        .error(function (response) {
          alert("Fail to get the users by region : " + regionlist[i]);
          console.log("app userService method-getUserByRegion Fail to get---error message : ", response.error);
        })
    }
  }

  var fillGroups=function(callback){
      mygroups=[];
      $http.get(ipAddress + "/regions",{headers:{Authorization : auth}})
        .success(function (response) {
          regionlist = response;
          for (var i = 0; i < regionlist.length; i++) {
            mygroups[i] = {
              name: regionlist[i],
              items: [],
              show: false,
              isfill: false
            };
            fillGroup(mygroups[i]);
          }
          callback();
        })
        .error(function (response) {
          alert("Fail to get the regions");
          console.log("app ConstactsController Fail to get regions --- error message : ", response.error);
        })
    return mygroups;
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
    fillGroups:function(callback){
      fillGroups(callback);
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
    setReceiverListNull:function(){
      return setReceiverListNull();
    },
    updateCheckedbyReceiverList :function(){
      //need improving!!!!
      updateCheckedbyReceiverList();
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
          $http({
            method : "POST",
            url : ipAddress + "/commands",
            data : command[i],
            headers : {
              Authorization : auth
            }
          })

            .success(function (response) {
              console.log(response.updated_time);

            })
            .error(function (response) {
              alert("send failed")
            })

        }
      }
      setReceiverListNull();
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
      data : publishinfo,
      headers : {
        Authorization : auth
      }
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
              'Content-Length' : blob.size,
              Authorization : auth
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
                'Content-Length' : blob.size,
                Authorization : auth
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
      url : ipAddress + "/information",
      headers : {
        Authorization : auth
      }
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

  function getInformation(infoID, callback, callbackError){
    $http({
      method : "GET",
      url : ipAddress + "/information/" + infoID,
      headers : {
        Authorization : auth
      }
    }).success(function (data, status, headers, config) {
      console.log("成功获取详细信息");
      callback(data);
    }).error(function (data, status, headers, config) {
      console.log("获取详细信息失败");
      callbackError(data);
    })
  }

  function getImages(information, callback){
    var images = information.images;
    for (var i in images){
      $http({
        method : "GET",
        url : ipAddress + "/images/" + images[i].id,
        responseType: 'arraybuffer',
        headers : {
          Authorization : auth
        }
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
      url : ipAddress + "/information/" + infoID,
      headers : {
        Authorization : auth
      }
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

app.factory('replicationServer',function ($http) {

  var replicationInstance = {
    replier : "",
    content : ""
  }

  function sendReplication(replication, infoID, callbackSuccess, callbackFail) {
    console.log("回复发送地址：" + ipAddress + "/information/" + infoID + "/replications");
    $http({
      method : "POST",
      url : ipAddress + "/information/" + infoID + "/replications",
      data : replication,
      headers : {
        Authorization : auth
      }
    }).success(function (data) {
      console.log("回复发送成功");
      callbackSuccess();
    }).error(function (data, status, headers, config) {
      console.log("回复发送失败");
      if (status == 404)
        console.log("该情报已删除");
      callbackFail();
    })
  }

  return {
    replicationInstance : function(){
      replicationInstance.replier = "";
      replicationInstance.content = "";
      return replicationInstance
    },
    sendReplication : sendReplication
  }
})

app.factory('Camera', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();
      navigator.camera.getPicture(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      return q.promise;
    }
  }
})

app.factory('documentService',function($http) {
  var Mainclass={
    "军事训练":[
      "通知计划",
      "训练法规",
      "资料查询",
      "训练考核"
    ],
    "教育管理":[
      "通知计划",
      "教育资料",
      "法规命令",
      "成果交流"
    ],
    "国防动员":[
      "组织机构",
      "法规政策",
      "兵员征集",
      "基本潜力"
    ]
  };
  var MainclassArray=["军事训练","教育管理","国防动员"];

  var doc = {};

  function getDocument(classname, subclassname, callback){
    $http({
      method : "GET",
      url : ipAddress + "/documents/" + classname + "/" + subclassname,
      headers : {
        Authorization : auth
      }
    }).success(function (response) {
      console.log("获取文档成功");
      callback(response);
    }).error(function (response) {
      console.log("获取文档失败");
    })
  }

  function setDocument(document) {
    doc = document;
    console.log("-------" + doc.title)
  }

  return {
    getMainclass:function(){
      return MainclassArray;
    },
    getSubclassByIndex:function(index) {
      console.log("index is"+index);
      console.log("Mainclass.index   "+Mainclass[index])
      return Mainclass[index];
    },
    getDocument : getDocument,
    setDocument : setDocument,
    getDetailDocument : function () {
      return doc;
    }
  }
})

app.factory('passwordService', function ($http){
  function changePassword(username, newPassword, callbackSuccess, callbackError){
    var authentication = {
      username : username,
      password : newPassword
    }
    $http({
      method : "PUT",
      url : ipAddress + "/authentications/" + username,
      data : authentication,
      headers:{
        Authorization : auth
      }
    }).success(function (data, status, headers, config) {
      console.log("修改密码成功")
      callbackSuccess();
    }).error(function (data, status, headers, config) {
      if (status == 401 || status == 422 || status == 403){
        console.log("修改密码失败-客户端有误");
      }
      else{
        console.log("修改密码失败-错误不明");
      }
      callbackError();
    })
  }

  return {
    changePassword : changePassword
  }
})
