angular.module('ngHighLightText', []).directive('highLightText', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $timeout(function(){
          element.highLightText(scope[attrs.highLightText].text, scope[attrs.highLightText])
        })
      }
    }
  }
])