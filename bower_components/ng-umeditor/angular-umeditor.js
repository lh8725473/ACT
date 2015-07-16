angular.module('ng-umeditor', []).directive('ngUmeditor', function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    socpe: {},
    link: function(scope, element, attrs, ngModel) {
      var editor;
      if (ngModel === null) {
        throw Error('ngModel be require');
        return null;
      }
      editor = UM.getEditor(element[0]);
      ngModel.$render(function() {
        return editor.ready(function() {
          return editor.setContent(ngModel.$viewValue || '');
        });
      });
      return editor.addListener('selectionchange', function() {
        return scope.$apply(function() {
          return ngModel.$setViewValue(editor.getContent());
        });
      });
    }
  };
});