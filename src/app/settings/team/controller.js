  angular.module('App.Settings.Team').controller('App.Settings.Team.Controller', [
  '$scope',
  'Notification',
  'Users',
  '$cookies',
  'Cloud',
  '$state',
  function(
    $scope,
    Notification,
    Users,
    $cookies,
    Cloud,
    $state
  ) {

  //获取个人信息
  $scope.userInfo = Users.getUserInfo()

  //所属团队列表
  $scope.cloudList = Cloud.cloudList()

  //设置默认团队
  $scope.updateUserInfo = function(cloud) {
    Users.updateUserInfo({

    }, {
      cloud_id: cloud.cloud_id

    }).$promise.then(function() {
      $scope.userInfo.cloud_id_default = cloud.cloud_id

      Notification.show({
        title: '成功',
        type: 'success',
        msg: '设置默认团队成功',
        closeable: false
      })
      // $state.go('settings.team', {
      //   cloudId: cloud.cloud_id,
      // })
    }, function(error) {
      Notification.show({
        title: '失败',
        type: 'danger',
        msg: error.data.result,
        closeable: false
      })
    })
  }
  

  }
])