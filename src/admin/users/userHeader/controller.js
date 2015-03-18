angular.module('App.Users.UserHeader').controller('App.Users.UserHeader.Controller', [
  '$scope',
  '$state',
  function (
    $scope,
    $state
  ) {
    $scope.$state = $state
  }
])