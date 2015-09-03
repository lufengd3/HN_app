angular.module('starter.controllers')

.controller('FontCtrl', function($rootScope, $scope) {
  $scope.adjustFont = function(newVal, oldVal) {
    window.localStorage['fontSize'] = $scope.fontSize;
  	$rootScope.$broadcast('fontsizeChanged', {fontSize: $scope.fontSize});
  }
})
