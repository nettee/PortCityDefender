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

