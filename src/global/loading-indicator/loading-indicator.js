angular.module('ACT.LoadingIndictor', []).directive('loadingIndicator', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/global/loading-indicator/template.html'
    }
  }
])