angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('NewsCtrl', function($scope, $ionicLoading, $ionicScrollDelegate, 
	  $cordovaNetwork, $cordovaToast, $timeout, HnService) {

  $scope.saveTopNewsId = function() {
	$scope.error = false;
	$ionicLoading.show();
  	HnService.saveTopNewsId()
  }

  $scope.loadNews = function() {
	$ionicLoading.show();
	$scope.error = false;
  	HnService.loadNews()
	  .then(function(data) {
		$ionicLoading.hide();
	  	$scope.newsList = data;
	  })
  }

  $scope.saveTopNewsId();

  $scope.$on('HnService.topNewsIdSvaed', function() {
	$scope.loadNews();
  })

  $scope.$on('HnService.newsLoadedOff', function() {
	$cordovaToast.showLongCenter('It\' time to have a rest :)')	
	$scope.$broadcast('scroll.infiniteScrollComplete');
  })

  $scope.$on('HnService.indexError', function() {
	$scope.error = true;
  	$ionicLoading.hide();
	if ($cordovaNetwork.isOffline()) {
	  $cordovaToast.showLongCenter('Network unavailable. Try anain later.')	
	}
  })

  $scope.$on('$ionicView.beforeLeave', function() {
  	SCROLL_POSITION = $ionicScrollDelegate.getScrollPosition()
  })

  $scope.$on('$ionicView.beforeEnter', function() {
	if (SCROLL_POSITION != '')
	  $ionicScrollDelegate.scrollTo(SCROLL_POSITION.left, SCROLL_POSITION.top)
  })

  $scope.setGlobalNewsInfo = function(id, url, title) {
	PASSAGE_INFO.id = id;	
	PASSAGE_INFO.url = url;
  	PASSAGE_INFO.title = title;
  }

  $scope.loadMore = function() {
	// fetch news add to newsList
	HnService.loadNews()
  	  .then(function(data) {
	  	$scope.newsList = $scope.newsList.concat(data);
		$scope.$broadcast('scroll.infiniteScrollComplete');
	  })
  }

})

.controller('PassageCtrl', function($scope, $ionicPopover, $ionicPopup, $ionicHistory, $cordovaSocialSharing,
	  $ionicLoading, $cordovaClipboard, $cordovaToast, $ionicScrollDelegate, $timeout, $sce, HnService) 
{
  $scope.initPage = function() {
	$ionicLoading.show();
	$scope.fontSize = window.localStorage['fontSize']; 
	$ionicScrollDelegate.scrollTop();
	$scope.title = PASSAGE_INFO.title;
	$scope.url = PASSAGE_INFO.url;
	$scope.passageHtml = '';
	HnService.getPassage(PASSAGE_INFO.id)
	// HnService.getPassage(12345)
	  .then(function(data) {
		if (data == null) {
		  // my server not crawl the content yet
		  data = "<p>Sorry, maybe the spider is sleeping, you can read in browser.</p>";
		}
		$scope.passageHtml = $sce.trustAsHtml(data);
	  })  
  }

  $scope.$watch(PASSAGE_INFO.id, function() {
	$scope.initPage();
  })

  $scope.openInBrowser = function() {
	window.open($scope.url, "_system");
  }

  $scope.$on('HnService.passageLoaded', function() {
	$ionicLoading.hide();
  })

  $scope.$on('HnService.passageError', function() {
	$ionicLoading.hide();
	$scope.passageHtml = "<p>Sorry, maybe the spider is sleeping, you can read in browser.</p>";
  })

  $ionicPopover.fromTemplateUrl('templates/settingPop.html', {
	scope: $scope,
  }).then(function(popover) {
	$scope.popover = popover;
  });

  $ionicPopover.fromTemplateUrl('templates/adjustFontPop.html', {
	scope: $scope,
  }).then(function(popover) {
	$scope.fontPopover = popover;
  });
  
  $scope.$on('fontsizeChanged', function(data) {
 	$scope.fontSize = data['fontSize']; 
  });

  $scope.goBack = function() {
  	$ionicHistory.goBack();
  }

  $scope.scrollTop = function() {
	$ionicScrollDelegate.scrollTop(true);
  }

  $scope.copyUrl = function() {
  	$cordovaClipboard.copy(PASSAGE_INFO.url)
	  .then(function() {
		$cordovaToast.showShortBottom('Copy Success.');
	  })
  }

  // social share
  $scope.share = function() {
	var message = "#HackerNews Today# " + $scope.title;
  	$cordovaSocialSharing.share(message, "", "", $scope.url)
	  .then(function(result) {
		if (result)
		  $cordovaToast.showShortBottom('Share Success.');
	  })
  }

})

.controller('CommentCtrl', function($scope, $http, $ionicHistory, $sce, 
	  $ionicLoading, HnService) {

  $scope.hide = false;
  $scope.comments = [];
  $scope.fontSize = window.localStorage['fontSize']; 

  $scope.showHtml = function(html) {
	return $sce.trustAsHtml(html); 
  }

  var getComments = function(parentId, parentName) {
	$http.get("https://hacker-news.firebaseio.com/v0/item/" + parentId + ".json")
  	  .then(function(res) {
	    if (res.data['kids'] != 'undefined') {
		  angular.forEach(res.data['kids'], function(id) {
			getComments(id, res.data['by']);
		  })
		}	
		if (parentId != PASSAGE_INFO.id ) {
		  if (parentName != $scope.passageAuthor) {
			res.data['text'] = '@' + parentName + ': ' + res.data['text'];
		  }
		  $scope.comments = $scope.comments.concat(res.data);
		} else {
		  $scope.passageAuthor = res.data['by'];
		}

		$ionicLoading.hide();
	  }, function(err) {
		$ionicLoading.hide();
		if ($cordovaNetwork.isOffline()) {
		  $cordovaToast.showLongCenter('Network unavailable. Try anain later.')	
		} else {
		  $cordovaToast.showLongCenter('Network error. Try anain later.')	
		}
	  })
  }

  $scope.$on('$ionicView.beforeEnter', function() {
  	$ionicLoading.show();
  })

  $scope.$on('fontsizeChanged', function(data) {
 	$scope.fontSize = data['fontSize']; 
  });

  getComments(PASSAGE_INFO.id)

  $scope.goBack = function() {
  	$ionicHistory.goBack();
  }

  $scope.setArrowClass = function(hide) {
  	return hide ? 'ion-arrow-right-b' : 'ion-arrow-down-b';
  }
})

.controller('FontCtrl', function($rootScope, $scope) {
  $scope.adjustFont = function(newVal, oldVal) {
    window.localStorage['fontSize'] = $scope.fontSize;
  	$rootScope.$broadcast('fontsizeChanged', {fontSize: $scope.fontSize});
  }
})
