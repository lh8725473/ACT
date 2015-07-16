angular.module('ngHighLightText', []).directive('highLightText', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $timeout(function(){
          element.highLightText(angular.fromJson(attrs.highLightText).text,  angular.fromJson(attrs.highLightText))
        })
        // scope.$watch('title', function () {
        //   element.highLightText(angular.fromJson(attrs.highLightText).text,  angular.fromJson(attrs.highLightText))
        // })
        watch(attrs, "title", function(){
          element.highLightText(angular.fromJson(attrs.highLightText).text,  angular.fromJson(attrs.highLightText))
        })
      }
    }
  }
])