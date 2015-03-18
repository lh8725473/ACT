angular.module('App.LinkShare').controller('App.LinkShare.InputPasswordController', [
  '$scope',
  '$rootScope',
  'CONFIG',
  'Share',
  'Utils',
  '$modal',
  '$state',
  'md5',
  '$cookieStore',
  'Notification',
  function(
    $scope,
    $rootScope,
    CONFIG,
    Share,
    Utils,
    $modal,
    $state,
    md5,
    $cookieStore,
    Notification
  ) {
    
    $scope.$on('neddPassword', function($event, neddPassword) {
      $scope.neddPassword = neddPassword
    })
    
    $scope.$on('key', function($event, key) {
      $scope.key = key
    })
    
    $scope.checkPassword = function(password){
      Share.checkPassword({
        key: $scope.key,
        pwd: md5.createHash(password)
      }).$promise.then(function() {
        $scope.neddPassword = false
        $rootScope.$broadcast('password', md5.createHash(password));
        $cookieStore.put('password', md5.createHash(password))
      }, function (error) {
            Notification.show({
                title: '失败',
                type: 'danger',
                msg: error.data.result,
                closeable: false
            })
        }
      )
    }
  }
])