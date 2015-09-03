angular.module('starter.controllers')

// index controller
.controller('NewsCtrl', function($scope, $rootScope, $ionicLoading, 
  $ionicScrollDelegate, $cordovaNetwork, $cordovaToast, HnService) {

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

  $scope.setGlobalNewsInfo = function(id, url, title) {
    $rootScope.PASSAGE_INFO.id = id;	
    $rootScope.PASSAGE_INFO.url = url;
  	$rootScope.PASSAGE_INFO.title = title;
  }

	// fetch news add to newsList
  $scope.loadMore = function() {
    HnService.loadNews()
    .then(function(data) {
	  	$scope.newsList = $scope.newsList.concat(data);
      $scope.$broadcast('scroll.infiniteScrollComplete');
	  })
  }

  /** 
   * init page event
   */
  $scope.$on('HnService.topNewsIdSvaed', function() {
    $scope.loadNews();
  })

  $scope.$on('HnService.newsLoadedOff', function() {
    $cordovaToast.showLongCenter('It\' time to have a rest :)')	
    $scope.$broadcast('scroll.infiniteScrollComplete');
  })

  // fetch news list from firebase api error
  $scope.$on('HnService.indexError', function() {
    $scope.error = true;
  	$ionicLoading.hide();

    if ($cordovaNetwork.isOffline()) {
      $cordovaToast.showLongCenter('Network error. Try anain later.')	
    }
  })

  $scope.$on('$ionicView.beforeLeave', function() {
  	$rootScope.SCROLL_POSITION = $ionicScrollDelegate.getScrollPosition()
  })

  $scope.$on('$ionicView.beforeEnter', function() {
    if ($rootScope.SCROLL_POSITION) {
      $ionicScrollDelegate.scrollTo(
        $rootScope.SCROLL_POSITION.left, $rootScope.SCROLL_POSITION.top);
    }
  })

  $scope.saveTopNewsId();
})

