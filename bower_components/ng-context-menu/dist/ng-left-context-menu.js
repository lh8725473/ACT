/**
 * ng-context-menu - v0.1.6 - An AngularJS directive to display a context menu when a right-click event is triggered
 *
 * @author Ian Kennington Walter (http://ianvonwalter.com)
 */
angular
  .module('ng-left-context-menu', [])
  .factory('LeftContextMenuService', function() {
    return {
      element: null,
      menuElement: null
    };
  })
  .directive('leftContextMenu', ['$document', 'LeftContextMenuService', function($document, LeftContextMenuService) {
    return {
      restrict: 'A',
      scope: {
        'callback': '&LeftContextMenu',
        'disabled': '&LeftContextMenuDisabled'
      },
      link: function($scope, $element, $attrs) {
        var opened = false;

        function open(event, menuElement) {
          menuElement.addClass('open');

          var doc = $document[0].documentElement;
          var docLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
            docTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0),
            elementWidth = menuElement[0].scrollWidth,
            elementHeight = menuElement[0].scrollHeight;
          var docWidth = doc.clientWidth + docLeft,
            docHeight = doc.clientHeight + docTop,
            totalWidth = elementWidth + event.pageX,
            totalHeight = elementHeight + event.pageY,
            left = Math.max(event.pageX - docLeft, 0),
            top = Math.max(event.pageY - docTop, 0);

          if (totalWidth > docWidth) {
            left = left - (totalWidth - docWidth);
          }

          if (totalHeight > docHeight) {
            top = top - (totalHeight - docHeight);
          }

          menuElement.css('top', top + 'px');
          menuElement.css('left', left + 'px');
          opened = true;
        }

        $element.bind('click', function(event) {
          if (!$scope.disabled()) {
            if (LeftContextMenuService.menuElement !== null) {
              close(LeftContextMenuService.menuElement);
            }
            LeftContextMenuService.menuElement = angular.element(document.getElementById($attrs.target));
            LeftContextMenuService.element = event.target;
            //console.log('set', ContextMenuService.element);

            event.preventDefault();
            event.stopPropagation();
            $scope.$apply(function() {
              $scope.callback({ $event: event });
              open(event, LeftContextMenuService.menuElement);
            });
          }
        });

        function close(menuElement) {
          menuElement.removeClass('open');
          opened = false;
        }

        function handleKeyUpEvent(event) {
          //console.log('keyup');
          if (!$scope.disabled() && opened && event.keyCode === 27) {
            $scope.$apply(function() {
              close(LeftContextMenuService.menuElement);
            });
          }
        }

        function handleClickEvent(event) {
          if (!$scope.disabled() &&
            opened &&
            (event.button !== 0 || event.target !== LeftContextMenuService.element)) {
            $scope.$apply(function() {
              close(LeftContextMenuService.menuElement);
            });
          }
        }

        $document.bind('keyup', handleKeyUpEvent);
        // Firefox treats a right-click as a click and a contextmenu event while other browsers
        // just treat it as a contextmenu event
        $document.bind('click', handleClickEvent);

        $scope.$on('$destroy', function() {
          //console.log('destroy');
          $document.unbind('keyup', handleKeyUpEvent);
          $document.unbind('click', handleClickEvent);
        });
      }
    };
  }]);
