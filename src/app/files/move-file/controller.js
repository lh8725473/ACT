angular.module('App.Files').controller('App.Files.MoveFileController', [
  '$scope',
  '$modal',
  '$modalInstance',
  '$state',
  'obj',
  'moveList',
  'parentIdList',
  'Folders',
  'Files',
  'Notification',
  'Utils',
  function(
    $scope,
    $modal,
    $modalInstance,
    $state,
    obj,
    moveList,
    parentIdList,
    Folders,
    Files,
    Notification,
    Utils
  ) {
    $scope.obj = obj
    $scope.moveList = moveList
    //移动文件（夹）ids
    var del_ids = []
    if($scope.obj){
      if($scope.obj.folder){
        del_ids.push($scope.obj.folder_id)
      }
    }else{
      del_ids = $scope.moveList.folder_ids
    }

    $scope.treedata = Folders.getTree({
      type: 'list',
      del_ids: '[' + del_ids.toString() + ']'
    })

    $scope.treedata.$promise.then(function(treedata) {
      var zNodes = []
      angular.forEach(treedata, function(data) {
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
        onClick: function(event, treeId, treeNode, clickFlag) {
          $scope.folderTreeId = treeNode.id;
          $scope.folderTreeName = treeNode.name;
        }
      }
    }

    //  // FCUK code
    //  var treeId = $scope.treeId = 'folderTree';
    //  $scope[treeId] = $scope[treeId] || {};
    //
    //  //if node head clicks,
    //  $scope[treeId].selectNodeHead = $scope[treeId].selectNodeHead || function(selectedNode) {
    //
    //    //Collapse or Expand
    //    selectedNode.collapsed = !selectedNode.collapsed;
    //  };
    //
    //  //if node label clicks,
    //  $scope[treeId].selectNodeLabel = $scope[treeId].selectNodeLabel || function(selectedNode) {
    //
    //    //remove highlight from previous node
    //    if ($scope[treeId].currentNode && $scope[treeId].currentNode.selected) {
    //      $scope[treeId].currentNode.selected = undefined;
    //    }
    //
    //    //set highlight to selected node
    //    selectedNode.selected = 'selected';
    //
    //    //set currentNode
    //    $scope[treeId].currentNode = selectedNode;
    //  };
    //  // FCUK code end
    //
    //  $scope.$watch('abc.currentNode', function(newObj, oldObj) {
    //    if ($scope.abc && angular.isObject($scope.abc.currentNode)) {
    //      //          console.log('Node Selected!!');
    //      //          console.log($scope.folderTree.currentNode);
    //    }
    //  }, false);

    $scope.ok = function() {
      if ($scope.folderTreeId == undefined) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: '请选择文件夹',
          closeable: false
        })
        return;
      }

      var keepGoing = true;
      angular.forEach(parentIdList, function(parentId) {
        if (keepGoing) {
          if (parentId == $scope.folderTreeId) {
            Notification.show({
              title: '失败',
              type: 'danger',
              msg: 'LANG_MOVE_FILES_NOT_BE_CURRENT_FOLDER',
              closeable: false
            });
            keepGoing = false;
          }
        }
      });

      if (!keepGoing) return false;

      var moveListLength = 1;
      if ($scope.moveList.length != 0) {
        moveListLength = $scope.moveList.file_ids.length + $scope.moveList.folder_ids.length;
      }

      Notification.show({
        title: '成功',
        type: 'success',
        msg: '正在移动 ' + moveListLength + ' 条记录到 XXX' + $scope.folderTreeName,
        closeable: false
      });

      var moveObjModal = $modal.open({
        templateUrl: 'src/app/files/move-file/move-file-confirm.html',
        windowClass: 'delete-file',
        backdrop: 'static',
        controller: moveObjController,
        resolve: {
          moveList: function() {
            return $scope.moveList;
          },
          obj: function() {
            return $scope.obj;
          },
          folderTreeId: function() {
            return $scope.folderTreeId;
          },
          folderTreeName: function() {
            return $scope.folderTreeName;
          }
        }
      });
    }

    // move file
    var moveObjController = [
      '$scope',
      '$modalInstance',
      'moveList',
      'obj',
      'folderTreeId',
      'folderTreeName',
      'Folders',
      'Files',
      'Notification',
      function(
        $scope,
        $modalInstance,
        moveList,
        obj,
        folderTreeId,
        folderTreeName,
        Folders,
        Files,
        Notification
      ) {
        $scope.moveList = moveList;
        $scope.obj = obj;
        $scope.folderTreeId = folderTreeId;
        $scope.ok = function() {
          if ($scope.moveList.length == 0) { //移动单个
            var folder_id = $scope.obj.folder_id;
            var file_id = $scope.obj.file_id;
            if ($scope.obj.folder) { //文件夹
              Folders.update({
                folder_id: folder_id
              }, {
                parent_id: $scope.folderTreeId
              }).$promise.then(function() {
                moved(folder_id, folderTreeName);
              }, function(error) {
                if (!Utils.isReturnErrorDetails(error)) {
                  Notification.show({
                    title: '失败',
                    type: 'danger',
                    msg: 'LANG_FILE_MOVE_FAILED_ERROR',
                    closeable: false
                  })
                }
              })
            } else { //文件
              Files.updateFile({
                file_id: file_id
              }, {
                parent_id: $scope.folderTreeId
              }).$promise.then(function() {
                moved(file_id, folderTreeName);
              }, function(error) {
                if (!Utils.isReturnErrorDetails(error)) {
                  Notification.show({
                    title: '失败',
                    type: 'danger',
                    msg: 'LANG_FILE_MOVE_FAILED_ERROR',
                    closeable: false
                  })
                }
              })
            }
          } else { //批量移动
            Files.moveFileList({
              parent_id: $scope.folderTreeId
            }, {
              file_ids: $scope.moveList.file_ids,
              folder_ids: $scope.moveList.folder_ids
            }).$promise.then(function(moveListResponse) {
              moveListObj(moveListResponse, folderTreeName);
            }, function(error) {
              if (!Utils.isReturnErrorDetails(error)) {
                Notification.show({
                  title: '失败',
                  type: 'danger',
                  msg: 'LANG_FILE_MOVE_FAILED_ERROR',
                  closeable: false
                })
              }
            })
          }
          $modalInstance.dismiss('cancel');
        }
        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        }
      }
    ]

    function moveListObj(moveListResponse, moveFolderName) {
      var moveResponse = {
        moveListResponse: moveListResponse,
        moveFolderName: moveFolderName,
      }
      $modalInstance.close(moveResponse);
    }

    function moved(file_id, moveFolderName) {
      var moveResponse = {
        file_id: file_id,
        moveFolderName: moveFolderName,
      }
      $modalInstance.close(moveResponse);
    }

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    }
  }
])