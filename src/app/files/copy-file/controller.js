angular.module('App.Files').controller('App.Files.CopyFileController', [
  '$scope',
  '$modal',
  '$modalInstance',
  'obj',
  'copyList',
  'Folders',
  'Files',
  'Notification',
  'Confirm',
  function (
    $scope,
    $modal,
    $modalInstance,
    obj,
    copyList,
    Folders,
    Files,
    Notification,
    Confirm
  ) {
      $scope.obj = obj
      $scope.copyList = copyList

      $scope.treedata = Folders.getTree({
          type: 'list'
      })

      $scope.treedata.$promise.then(function (treedata) {
          var zNodes = []
          angular.forEach(treedata, function (data) {
              var node = {
                  id: data.id,
                  pId: data.parent,
                  name: data.text,
                  t: data.text,
                  open: (data.parent === "#") ? true : false //根目录打开
              }
              zNodes.push(node)
          })
          $scope.setting.zNodes = zNodes
      })

      $scope.setting = {
          data: {
              key: {
                  title: "t"
              },
              simpleData: {
                  enable: true
              }
          },
          callback: {
              onClick: function (event, treeId, treeNode, clickFlag) {
                  $scope.folderTreeId = treeNode.id
              }
          }
      }

      $scope.ok = function () {
          if ($scope.folderTreeId == undefined) {
              Notification.show({
                  title: '失败',
                  type: 'danger',
                  msg: '请选择文件夹',
                  closeable: false
              })
              return;
          }

          Confirm.show({
              title: 'LANG_COPY_FILES',
              content: 'LANG_COPY_FILES_CONFIRM',
              ok: function ($modalInstance) {
                  copyFiles($scope.copyList, $scope.folderTreeId, $modalInstance)
              }
          })

          function copyFiles(copyList, folderTreeId, $modalInstance) {
              Files.copyFileList({
                  parent_id: folderTreeId
              }, {
                  file_ids: copyList.file_ids,
                  folder_ids: copyList.folder_ids
              }).$promise.then(function (copyListResponse) {
                  copyListObj(copyListResponse);
              }, function (error) {
                  Notification.show({
                      title: '失败',
                      type: 'danger',
                      msg: error.data.result,
                      closeable: false
                  })
              })

              $modalInstance.dismiss('cancel');
          }
      }

      function copyListObj(copyListResponse) {
          $modalInstance.close(copyListResponse);
      }

      $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
      }
  }
])