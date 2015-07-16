angular.module('ngzTree', []).directive('zTree', ['$timeout',
	function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
        $timeout(function(){
          $.fn.zTree.init(element, scope[attrs.setting], scope[attrs.setting].zNodes);
        })
        scope.$watch(attrs.setting + '.' + attrs.zNodes, function () {
          $.fn.zTree.init(element, scope[attrs.setting], scope[attrs.setting].zNodes);
        })
			}
		}
	}
]);