angular.module('App.Sidebar').controller('App.Sidebar.Controller', [
  '$scope',
  '$state',
  function(
    $scope,
    $state
  ) {
    // TODO remove this hack when ui.router update
    $scope.$state = $state
  }
])