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

  var usersInRegion = function (region) {
    var userlist = [];

    $http.get("http://121.40.97.40:3000/users?region=" + region)
      .success(function (response) {
        for (var i = 0;i < response.length;i++){
          var usertemp = new newuser(response[i].id,response[i].name,response[i].level,response[i].region,response[i].description,response[i].phone);
          userlist.push(usertemp);
        }
      })
      .error(function (response) {
        alert("Fail to get the users by region : " + region);
        console.log("app userService method-getUserByRegion Fail to get---error message : ", response.error);
      })

    return userlist;
  }

  var getUserFromId = function (id) {
    var usertemp = {
      id : "txp",
      name : "陶先平",
      level : 2,
      region : "south",
      description : "后勤部部长",
      phone : "12345",
    };
    $http.get("http://121.40.97.40:3000/users?id=" + id)
      .success(function (response) {
        response = response[0];
        usertemp.id = response.id;
        usertemp.name = response.name;
        usertemp.level = response.level;
        usertemp.region = response.region;
        usertemp.description = response.description;
        usertemp.phone = response.phone;
      })
      .error(function (response) {
        alert("Fail to get the user by id : " + id);
        console.log("app userService method-getUserFromId Fail to get---error message : ", response.error);
      })
    return usertemp;
  }

  return {
    getUsersByRegion : function (region) {
      //return usersInRegion(region);
      var userlist = [];
      var temp = new regionuser("txp","陶先平",2);
      userlist.push(temp);
      temp = new regionuser("yinyt","尹一通",3);
      userlist.push(temp);
      return userlist;
    },

    getUser : function () {
      return user;
    },

    getUserById : function (username) {
      return getUserFromId(username);
    },

    setUsername : function(id){
      user.id = id;
      fillUser(id);
    }
  };
});
