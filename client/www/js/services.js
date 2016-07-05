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

app.factory('commandService',function($http){

  var commandList ={}
  var draftCommand={}
  var draftCommand={
    sender: 'mymy',
    receiver:'default' ,
    content: 'default content'
}
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
  }
  return {
    getCommandList:function(){
      return commandList;
    },
    getCommandByIndex:function(index){
      return  commandList[index];
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
