angular.module('starter.controllers')

// comment page
.controller('CommentCtrl', function($scope, $http, $ionicHistory, 
    $sce, $ionicLoading, $stateParams, HnService) {

  $scope.hide = false;
  $scope.comments = [];
  $scope.fontSize = window.localStorage['fontSize']; 

  $scope.showHtml = function(html) {
    return $sce.trustAsHtml(html); 
  }

  // get passage comments from firebase api
  var getComments = function(parentId, parentName) {
    $http.get("https://hacker-news.firebaseio.com/v0/item/" + parentId + ".json")
    .then(function(res) {
	    if (res.data['kids'] != 'undefined') {
        angular.forEach(res.data['kids'], function(id) {
        getComments(id, res.data['by']);
        })
      }	

      if (parentId != $stateParams.pid ) {
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

  /**
   * init event
   */
  $scope.$on('$ionicView.beforeEnter', function() {
  	$ionicLoading.show();
  })

  $scope.$on('fontsizeChanged', function(data) {
    $scope.fontSize = data['fontSize']; 
  });

  /** 
   * set event handler
   */
  $scope.goBack = function() {
  	$ionicHistory.goBack();
  }

  $scope.setArrowClass = function(hide) {
  	return hide ? 'ion-arrow-right-b' : 'ion-arrow-down-b';
  }

  getComments($stateParams.pid)

})
