angular.module('starter.filters', [])

.filter('domain', function() {
  	// return the domain name from the url
	// input: http://www.google.com/hello
	// output: www.google.com
	return function(url) {
	  var domainName;
	  var pattern = /http[s]*:\/\/([^\/]+)\//i;
	  domainName = url.match(pattern);
	  return domainName[1];
	}
})

.filter('escape', function() {
    return window.encodeURIComponent;
})
