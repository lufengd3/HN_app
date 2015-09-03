// Hacker News Reader App

// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 
    'starter.services', 'starter.filters'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default 
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  // define global variables
  $rootScope.PASSAGE_INFO = {
    'id': '',	   // current passage's id
    'title': '', // current passage's title
    'url': ''	   // current passage's url
  };	

  $rootScope.SCROLL_POSITION = '';	// remember the scroll position of the newslist page

  // set font size
  window.localStorage['fontSize'] = window.localStorage['fontSize'] || 16;
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider

  .state('news', {
    url: '/news',
    templateUrl: 'template/newsList.html',
    controller: 'NewsCtrl'
  })

  .state('passage', {
    url: '/passage/:pid',
    controller: 'PassageCtrl',
    templateUrl: 'template/passage.html'
  })

  .state('comments', {
    url: '/comments/:pid',
  	controller: 'CommentCtrl',
    templateUrl: 'template/comments.html',
  })

  // index page
  $urlRouterProvider.otherwise('/news');

});

