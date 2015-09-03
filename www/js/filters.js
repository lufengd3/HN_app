angular.module('starter.filters', [])

.filter('domain', function() {
  // return the domain name from the url
	// input: http://www.google.com/hello
	// output: www.google.com
	return function(url) {
	  var domainName;
	  var pattern = /http[s]*:\/\/([^\/]+)\//i;

	  domainName = url.match(pattern);

	  return domainName[1] || '';
	}
})

.filter('formatCommentHtml', function() {
    return function(html) {
      html = String(html).replace(/<[\/]?p>/gm, '');

      return html.replace(/href=['"](.*)['"]/gm, 'href=""');
    }
})
