angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('NewsCtrl', ['$scope', '$http', '$location', function($scope, $http) {
  // $scope.news = News.all();
  $scope.news = [];
  var getNews = function() {
	$http.get('https://hacker-news.firebaseio.com/v0/topstories.json')
	  .success(function (data, status, headers, config) {
		getNewsDetail(data);
	  })
	  .error(function(data) {
		alert('Get News Error: ' + data)
	  })
  };

  var getNewsDetail = function(data) {
	var news = [];
	if (data.length) {
	  for (var i =0; i < 8; i++) {
		$http.get('https://hacker-news.firebaseio.com/v0/item/' + data[i]  +'.json')
		  .success(function (data, status) {
			$scope.news.push(data)
		  })
		  .error(function(data) {
			alert('Get News Detail Error: ' + data)
		  })
	  }
	}
  }

  getNews();

  $scope.setGlobalNewsInfo = function(id, url, title) {
	PASSAGE_INFO.id = id;	
	PASSAGE_INFO.url = url;
  	PASSAGE_INFO.title = title;
  }

  $scope.loadMore = function() {
	loaded();
	clearTimeout(loaded);
  }

  var loaded = setTimeout(function() {
	$scope.$broadcast('scroll.infiniteScrollComplete');
  }, 3000)

}])

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('PassageCtrl', function($scope, $stateParams, 
	  $http, $ionicPopover, $ionicHistory, $cordovaClipboard, $ionicScrollDelegate) 
{
  $scope.initPage = function() {
	$ionicScrollDelegate.scrollTop();
	$scope.title = PASSAGE_INFO.title;
	$scope.url = PASSAGE_INFO.url;
	
	$http.jsonp('http://201205917.xyz/passage/' + $stateParams.id +'.json?callback=JSON_CALLBACK')
	  .success(function (data, status, headers, config) {
		if (data.content == null) {
			data.content = '<p>获取内容失败，请在浏览器中查看</p>';
		}
		document.getElementById('passage').innerHTML = data.content;
	  }).error(function(data) {
		alert("jsonp error: " + data);
	  });
  }

  $scope.initPage();

  $scope.$on("$ionicView.beforeEnter", function() {
	if (PASSAGE_INFO.id != $stateParams.id) {
		$scope.initPage();
	}
  })


  $scope.openInBrowser = function() {
	window.open($scope.url, "_system");
  }

  // passage menu
  $scope.favoriate = false;
  $scope.favoriateClass = ($scope.favoriate ? 'icon ion-ios-star' : 'icon ion-ios-star-outline');

  $scope.setFavoriate = function(like) {
	$scope.favoriate = like;
	$scope.favoriateClass = (like ? 'icon ion-ios-star' : 'icon ion-ios-star-outline');
  }

  $ionicPopover.fromTemplateUrl('templates/passagePopover.html', {
	scope: $scope,
  }).then(function(popover) {
	$scope.popover = popover;
  });

  $scope.goBack = function() {
  	$ionicHistory.goBack();
  }

  $scope.scrollTop = function() {
	$ionicScrollDelegate.scrollTop();
  }

  $scope.copyUrl = function() {
  	$cordovaClipboard.copy(PASSAGE_INFO.url)
  		.then(function() {
			alert('已复制到剪贴板');
		}, function() {
			alert('复制失败');
		})
  }

})
