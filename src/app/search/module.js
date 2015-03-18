angular.module('App.Search', ["ngClipboard"]).config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("./bower_components/zeroclipboard/dist/ZeroClipboard.swf");
  }]);