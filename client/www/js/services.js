var app = angular.module('ionicApp.services',[])

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
    $http.get("http://121.40.97.40:3000/users?id=" + id)
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
    $http.get("http://121.40.97.40:3000/users?id=" + id)
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
  var fillCommand=function(callback)
  {
    $http.get("http://121.40.97.40:3000/commands?receiver=" + userService.getUser().id)
      .success(function (response) {
       // commandList = response;
        callback(response);
      })
      .error(function () {
        alert("get command List failed");
      })
  }
  receiverList[0]={
    id:null,
    name:null
  }
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
      console.log("in send command");
      for(var i in ReceiverList) {
        console.log("in send command"+ReceiverList[i].name);
        command={
          receiver:ReceiverList[i].id,
          sender:myid,
          content:content
        }
        console.log("in send command"+command.receiver+"  "+command.sender+"  "+command.content);
        $http.post("http://121.40.97.40:3000/commands",command)
         .success(function(response){
           console.log(response.updated_time);
         })
          .error(function(response){
          })
      }
    }
  }
});

app.factory('informationService', function () {
  var user = {
    id : "",
    name : "",
    level : 1,
    region : "",
    description : "",
    phone : ""
  };

  var information = {
    id: 1,
    publisher: user,
    text: "",
    images:[],
    urgent: false,
    replications: [],
    time: ""
  };

  return {
    informationInstance : information
  };

});
