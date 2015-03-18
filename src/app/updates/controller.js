angular.module('App.Updates').controller('App.Updates.Controller', [
  '$scope',
  'CONFIG',
  function(
    $scope,
    CONFIG
  ) {
  	$scope.name = 'World';
  	
  	$scope.opts = {
  		disable: 'left',
  		touchToDrag : false
	};
	$scope.checked;
  }
])