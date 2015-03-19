angular.module('starter.services', ['firebase'])

.factory('HnService', function($rootScope, $http, $q, $firebaseObject) {
  var pageSize = 10;	   // how many news loaded once refresh

  var getNewsDetail = function(newsIdList) {
	// var newsIdList = [9205435,9205177,9204724,9204111,9203946,9204954,9204954];
	var deferred = $q.defer();
	var urlCalls = [];

	angular.forEach(newsIdList, function(newsId) {
	  urlCalls.push($http.get("https://hacker-news.firebaseio.com/v0/item/" + newsId + ".json"))
	})

	$q.all(urlCalls)
	  .then(function(res) {
		  deferred.resolve(res)
		},
		function(erros) {
		  $rootScope.$broadcast('HnService.indexError')
		  deferred.reject(error);
		},
		function(update) {
		  deferred.update(update);
		});
	
	return deferred.promise;
  }

  return {
	getPassage: function(newsId) {
	  return $http.jsonp("http://abc.xyz/passage/" + newsId + ".json?callback=JSON_CALLBACK")
		.then(function(res) {
			$rootScope.$broadcast('HnService.passageLoaded')
			return res.data.content;	
		}, function(error) {
			$rootScope.$broadcast('HnService.passageError')
		})
	},
	
	saveTopNewsId: function() {
	  return $http.get("https://hacker-news.firebaseio.com/v0/topstories.json")
		.then(function(res) {
		  	window.localStorage.recentNewsIdList = JSON.stringify(res.data);
			$rootScope.$broadcast('HnService.topNewsIdSvaed')
		}, function(error) {
			$rootScope.$broadcast('HnService.indexError')
		});
	},

	loadNews: function() {
	  var idList = JSON.parse(window.localStorage['recentNewsIdList']).splice(0, pageSize);
	  if (idList.length) {
		window.localStorage['recentNewsIdList'] = 
	      JSON.stringify(JSON.parse(window.localStorage['recentNewsIdList']).splice(pageSize));
		console.log(JSON.parse(window.localStorage['recentNewsIdList']).length);

		return getNewsDetail(idList);
	  } else {
		$rootScope.$broadcast('HnService.newsLoadedOff')
	  }
	}

  };
});
