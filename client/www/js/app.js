angular.module('ionicApp', ['ionic', 'ngCordova', 'ionicApp.controllers'])
  .run(function($rootScope, $ionicPlatform) {

    $rootScope.ipAddress = "http://121.40.97.40:3000"//"http://localhost:3000"//http://121.40.97.40:3000


    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
      })

      .state('menu', {
        url: '/menu',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MenuController'
      })

      .state('menu.firstpage', {
        url: '/firstpage',
        views: {
          'menuContent': {
            templateUrl: 'templates/firstpage.html',
            controller: 'FirstController'
          }
        }
      })

      .state('menu.document', {
        url: '/document',
        views: {
          'menuContent': {
            templateUrl: 'templates/document.html',
            controller: 'DocumentController'
          }
        }
      })
      .state('menu.documentSubclass', {
        url: '/document/:classname',
        views: {
          'menuContent': {
            templateUrl: 'templates/documentSubClass.html',
            controller: 'DocumentSubClassController'
          }
        }
      })
      .state('menu.documentSubclass.documentSubclassItem', {
        url: '/:subclassname',
        views: {
          'menuContent': {
            templateUrl: 'templates/documentSubClassItem.html',
            controller: 'DocumentSubClassItemController'
          }
        }
      })
      .state('menu.userpage', {
        url: '/userpage',
        views: {
          'menuContent': {
            templateUrl: 'templates/userpage.html',
            controller: 'UserController'
          }
        }
      })

      .state('menu.contacts', {
        url: '/contacts',
        views: {
          'menuContent': {
            templateUrl: 'templates/contacts.html',
            controller: 'ContactsController'
          }
        }
      })

      .state('menu.single', {
        url: '/contacts/:contactId',
        views: {
          'menuContent': {
            templateUrl: 'templates/contact.html',
            controller: 'ContactController'
          }
        }
      })

      .state('menu.information', {
        url: '/information',
        views: {
          'menuContent': {
            templateUrl: 'templates/information.html',
            controller: 'InfoController'
          }
        }
      })

      .state('menu.newInformation', {
        url: '/newInformation',
        views:{
          'menuContent': {
            templateUrl: 'templates/newInformation.html',
            controller: 'newInformationController'
          }
        }
      })

      .state('menu.detailInformation', {
        url: '/information/:infoID',
        views : {
          'menuContent':{
            templateUrl : 'templates/detailInformation.html',
            controller  : 'detailInformationController'
          }
        }
      })

      .state('menu.responseInformation', {
        url: '/responseInformation/:responseInfoID',
        views : {
          'menuContent':{
            templateUrl : 'templates/responseInformation.html',
            controller  : 'responseInformationController'
          }
        }
      })

      .state('menu.command', {
        url: '/command',
        views: {
          'menuContent': {
            templateUrl: 'templates/command.html',
            controller: 'commandController'
          }
        }
      })

      .state('menu.singleCommand', {
        url: '/command/:commandId',
        views: {
          'menuContent': {
            templateUrl: 'templates/singleCommand.html',
            controller: 'singleCommandController'
          }
        }
      })

      .state('menu.newCommand', {
        url: '/newCommand',
        views: {
          'menuContent': {
            cache:'false',
            templateUrl: 'templates/newCommand.html',
            controller: 'newCommandController'
          }
        }
      })

      .state('menu.commandReceiver',{
        url:'/commandReceiver',
        views:{
          'menuContent':{
            templateUrl:'templates/commandReceiver.html',
            controller:'commandReceiverController'
          }
        }
      })

     // $urlRouterProvider.otherwise('/login');

})

