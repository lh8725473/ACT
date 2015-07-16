angular.module('App.Settings').controller('App.Settings.Controller', [
  '$scope',
  'Cloud',
  'Notification',
  function (
    $scope,
    Cloud,
    Notification
  ) {
    $scope.cloudInfo = Cloud.info()

    $scope.packageInfoList = Cloud.getPackage()

    //更新团队设置
    $scope.updateCloudInfo = function(cloudInfo){
      Cloud.updateInfo({},{
        cloud_name:cloudInfo.cloud_name,
        address:cloudInfo.address,
        zipcode:cloudInfo.zipcode,
        is_invoice:cloudInfo.is_invoice
      }).$promise.then(function() {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '保存成功',
          closeable: false
        })
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