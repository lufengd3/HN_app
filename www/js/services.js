angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('News', function($http) {
  // Some fake testing data
  var news = [{
    id: 0,
    title: 'Ben Sparrow',
	domain: 'www.baidu.com',
	url: 'http://www.baidu.com',
  	time: '03-10 12:24'
  }, {
    id: 1,
    title: 'Max Lynx, Hey, it\'s me',
	domain: 'www.tmall.com',
    url: 'avatars3.githubusercontent.com',
  	time: '03-10 12:24'
  }, {
    id: 2,
    title: 'Did you get the ice cream?',
    url: 'www.alibaba.com',
  	time: '03-10 12:24'
  }, {
    id: 3,
    title: 'I should buy a boat',
    url: 'www.qq.com',
  	time: '03-10 12:24'
  }, {
    id: 4,
    title: 'Look at my mukluks!',
    url: 'www.baidu.com',
  	time: '03-10 12:24'
  }];

  // var getNews = function($http) {
	// $http.get('https://hacker-news.firebaseio.com/v0/topstories.json')
	  // .success(function (data, status, headers, config) {
		// return getNewsDetail($http, data);
	  // })
	  // .error(function(data) {
		// alert('Get News Error: ' + data)
	  // })
  // };

  // var getNewsDetail = function($http, data) {
	// var news = [];
	// if (data.length) {
	  // for (var i =0; i < data.length; i++) {
		// $http.get('https://hacker-news.firebaseio.com/v0/item/' + data[i]  +'.json')
		  // .success(function (data, status) {
			// news.push(data)
		  // })
		  // .error(function(data) {
			// alert('Get News Detail Error: ' + data)
		  // })
	  // }
	// }

	// return news;
  // }

  return {
    all: function() {
      return news;
    }
  };
});
