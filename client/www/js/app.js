angular.module('ionicApp', ['ionic','ionicApp.controllers'])
  .run(function($ionicPlatform) {
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

      .state('menu.command', {
        url: '/command',
        views: {
          'menuContent': {
            templateUrl: 'templates/command.html',
            controller: 'commandController'
          }
        }
      })
      .state('menu.newCommand', {
        url: '/newCommand',
        views: {
          'menuContent': {
            templateUrl: 'templates/newCommand.html',
            controller: 'newCommandController'
          }
        }
      })
      $urlRouterProvider.otherwise('/login');

})

