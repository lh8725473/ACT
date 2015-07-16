angular.module('ng-umeditor', []).directive('umeditor', ['$timeout',
	function($timeout) {
		return {
			restrict: 'C',
			link: function(scope, element, attrs) {
				var editor;
				editor = UM.getEditor(attrs.id);
			  editor.addListener('contentChange', function() {
			    scope.content = editor.getContent()
			  })
			  editor.ready(function(){
		      scope.editor = editor
		      editor.setContent(scope.content)
		    })
			}
		};
	}
]);