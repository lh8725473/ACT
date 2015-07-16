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
  'Utils',
  function (
    $scope,
    $modal,
    $modalInstance,
    obj,
    copyList,
    Folders,
    Files,
    Notification,
    Confirm,
    Utils
  ) {
      $scope.copyMenuClicked = false;
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
                  $scope.folderTreeId = treeNode.id;
                  $scope.folderTreeName = treeNode.name;
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
                  Notification.show({
                      title: '成功',
                      type: 'success',
                      msg: '正在复制 ' + ($scope.copyList.file_ids.length + $scope.copyList.folder_ids.length) + ' 条记录到' + $scope.folderTreeName,
                      closeable: false
                  })
                  copyFiles($scope.copyList, $scope.folderTreeId, $modalInstance);
              }
          })

          function copyFiles(copyList, folderTreeId, $modalInstance) {
              $scope.copyMenuClicked = true;
              Files.copyFileList({
                  parent_id: folderTreeId
              }, {
                  file_ids: copyList.file_ids,
                  folder_ids: copyList.folder_ids
              }).$promise.then(function (copyListResponse) {
                  $scope.copyMenuClicked = false;
                  copyListObj(copyListResponse, $scope.folderTreeName);
              }, function (error) {
                $scope.copyMenuClicked = false;
                if(!Utils.isReturnErrorDetails(error)){
                  Notification.show({
                      title: '失败',
                      type: 'danger',
                      msg: '复制文件时遇到了问题，请再试一次',
                      closeable: false
                  })
                }
              })

              $modalInstance.dismiss('cancel');
          }
      }

      function copyListObj(copyListResponse, folderTreeName) {
          var copyResponse = {
            copyListResponse: copyListResponse,
            copyFolderName: folderTreeName
          }
          $modalInstance.close(copyResponse);
      }

      $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
      }
  }
])