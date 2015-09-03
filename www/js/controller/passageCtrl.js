angular.module('starter.controllers')

// passage content page
.controller('PassageCtrl', function($scope, $rootScope, $ionicPopover, $ionicPopup, 
    $ionicHistory, $cordovaSocialSharing, $ionicLoading, $cordovaClipboard, 
    $cordovaToast, $ionicScrollDelegate, $sce, $stateParams, HnService) 
{
  // page init handler
  $scope.initPage = function() {
    $ionicScrollDelegate.scrollTop();
    $ionicLoading.show();
    $scope.fontSize = window.localStorage['fontSize']; 
    $scope.passageHtml = '';
    $scope.errorHint = "<p>Sorry, content not available now, "
                     + "you can read in browser.</p>";

    HnService.getPassage($stateParams.pid)
	  .then(function(data) {
      // if server does not crawl the content return error massage
      data = data || $scope.errorHint;
      $scope.passageHtml = $sce.trustAsHtml(data);
	  })  
  }

  /**
   * set page event
   */
  $scope.$on('HnService.passageLoaded', function() {
    $ionicLoading.hide();
  })

  $scope.$on('HnService.passageError', function() {
    $ionicLoading.hide();
    $scope.passageHtml = $scope.errorHint;
  })

  $scope.$on('fontsizeChanged', function(data) {
    $scope.fontSize = data['fontSize']; 
  });

  $scope.$watch($rootScope.PASSAGE_INFO.id, function() {
    $scope.initPage();
  })

  /** 
   * init compontent template
   */
  $ionicPopover.fromTemplateUrl('template/settingPop.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $ionicPopover.fromTemplateUrl('template/adjustFontPop.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.fontPopover = popover;
  });
  
  /**
   * set event handler
   */
  $scope.goBack = function() {
  	$ionicHistory.goBack();
  }

  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop(true);
  }

  $scope.copyUrl = function() {
  	$cordovaClipboard.copy($rootScope.PASSAGE_INFO.url)
	  .then(function() {
      $cordovaToast.showShortBottom('Copy Success.');
	  })
  }

  $scope.openInBrowser = function() {
    window.open($rootScope.PASSAGE_INFO.url, "_system");
  }


  $scope.share = function() {
    var message = "#HackerNews Today# " + $rootScope.PASSAGE_INFO.title;

  	$cordovaSocialSharing.share(message, "", "", $rootScope.PASSAGE_INFO.url)
	  .then(function(result) {
		  $cordovaToast.showShortBottom("Share Success");
	  }, function(err) {
		  $cordovaToast.showShortBottom('Error: ' + err);
	  })
  }

})

