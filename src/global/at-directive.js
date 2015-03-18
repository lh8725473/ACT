angular.module('Act.at', []).directive('at', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('shown.atwho', function () {
          scope.atOptions.onShown()
        })
        element.bind('hidden.atwho', function () {
          scope.atOptions.onHidden()
        })
        element.atwho(scope[attrs.at])
        scope.$watch('atOptions.data', function () {
          element.atwho('destroy').atwho(scope.atOptions)
        })
      }
    }
  }
]);
