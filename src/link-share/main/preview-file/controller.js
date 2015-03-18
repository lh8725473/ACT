angular.module('App.LinkShare').controller('App.LinkShare.PreviewFileController', [
  '$scope',
  '$rootScope',
  'Utils',
  '$modalInstance',
  'CONFIG',
  'obj',
  'Files',
  '$cookies',
  '$modal',
  '$state',
  '$cookieStore',
  function(
    $scope,
    $rootScope,
    Utils,
    $modalInstance,
    CONFIG,
    obj,
    Files,
    $cookies,
    $modal,
    $state,
    $cookieStore
  ) {

      $scope.obj = obj

      //加载动画
      $scope.loading = true

      $scope.content = ''

      $scope.key = $state.params.key

      $scope.fileType = Utils.getFileTypeByName(obj.file_name)

      var pwd = $cookieStore.get('password') ? $cookieStore.get('password') : ''

      if ('image' == $scope.fileType) {//图片预览
        $scope.imageSrc = CONFIG.API_ROOT + '/share/key?act=preview&key=' + $scope.key + '&pwd=' + pwd + '&file_id=' + obj.file_id
      } else if('note' == $scope.fileType){//笔记
        $scope.content = '<b>sadsadsadasdasdsad</b>'
      }else {//office或者pdf预览
        Files.preview(obj.file_id, $scope.key, pwd).then(function(htmlData) {
          $scope.loading = false
          $scope.previewValue = htmlData
        })
      }

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel')
      }
  }
])