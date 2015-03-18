angular.module('App.Sidebar').controller('App.Sidebar.Controller', [
  '$scope',
  '$state',
  'Users',
  function(
    $scope,
    $state,
    Users
  ) {
    // TODO remove this hack when ui.router update
    $scope.$state = $state
    
    $scope.storage = Users.getSpaceinfo()
    
  }
])