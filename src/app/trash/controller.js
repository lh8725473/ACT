angular.module('App.Trash').controller('App.Trash.Controller', [
  '$scope',
  'CONFIG',
  'Trash',
  'Utils',
  '$modal',
  'Notification',
  '$rootScope',
  function(
    $scope,
    CONFIG,
    Trash,
    Utils,
    $modal,
    Notification,
    $rootScope
  ) {

    //回收站文件列表
    $scope.recycleList = Trash.getRecycleList()

    $scope.recycleList.$promise.then(function(recycleList) {
      //回收站是否为空
      $scope.showEmpty = (recycleList.length == 0) ? false : true
      $scope.loading = false
    })

    //加载动画
    $scope.loading = true

    $scope.recycleList.$promise.then(function(recycleList) {
      angular.forEach(recycleList, function(recycle) {
        //对象是否被选中
        recycle.checked = false

        //对象是否是文件夹
        if (recycle.isFolder == 1) {
          recycle.folder = true
        } else {
          recycle.folder = false
        }

        //文件图像
        if (recycle.isFolder == 1) { //文件夹
          if (recycle.isShared == 1) {
            recycle.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small_share;
            recycle.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large_share;
          } else {
            recycle.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small;
            recycle.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large;
          }
        } else {
          var ext;
          if (recycle.isFolder == 1) {
            ext = 'folder';
          } else {
            ext = recycle.file_name.slice(recycle.file_name.lastIndexOf('.') + 1);
          }
          var icon = Utils.getIconByExtension(ext);
          recycle.smallIcon = icon.small;
          recycle.largeIcon = icon.large;
        }
      })
    })

    $scope.revertButton = false
    $scope.deleteButton = false
    //点击选择或者取消选中文件
    $scope.selectRecycle = function($event, recycle) {
      //阻止时间冒泡
      $event.stopPropagation()
      recycle.checked = !recycle.checked
      $scope.selectedAll = true
      for (var i = 0; i < $scope.recycleList.length; i++) {
        if (!$scope.recycleList[i].checked) {
          $scope.selectedAll = false
        }
      }
      for (var i = 0; i < $scope.recycleList.length; i++) {
        if ($scope.recycleList[i].checked) {
          $scope.revertButton = true
          $scope.deleteButton = true
          break
        }
        $scope.revertButton = false
        $scope.deleteButton = false
      }
    }

    //全部选择状态
    $scope.selectedAll = false

    $scope.selectedAllswitch = function() {
      angular.forEach($scope.recycleList, function(recycle) {
        recycle.checked = !$scope.selectedAll
      })
      for (var i = 0; i < $scope.recycleList.length; i++) {
        if ($scope.recycleList[i].checked) {
          $scope.revertButton = true
          $scope.deleteButton = true
          break
        }
        $scope.revertButton = false
        $scope.deleteButton = false
      }
    }

    //清空回收站
    $scope.emptyRecycle = function() {
      var emptyRecycleModal = $modal.open({
        templateUrl: 'src/app/trash/empty-recycle-confim.html',
        windowClass: 'empty-recycle',
        backdrop: 'static',
        controller: emptyRecycleController,
        resolve: {
          recycleList: function() {
            return $scope.recycleList
          }
        }
      })

      emptyRecycleModal.result.then(function() {
        Trash.emptyRecycle().$promise.then(function() {
          $scope.recycleList = []
          $scope.showEmpty = false
          $rootScope.$broadcast('storage')
        })
      })
    }

    // emptyRecycle file
    var emptyRecycleController = [
      '$scope',
      '$modalInstance',
      'recycleList',
      function(
        $scope,
        $modalInstance,
        recycleList
      ) {

        $scope.ok = function() {
          $modalInstance.close()
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    //彻底删除文件
    $scope.deleteRecycle = function() {
      var deleteRecycleModal = $modal.open({
        templateUrl: 'src/app/trash/delete-recycle-confim.html',
        windowClass: 'delete-recycle',
        backdrop: 'static',
        controller: deleteRecycleController,
        resolve: {
          recycleList: function() {
            return $scope.recycleList
          }
        }
      })
    }

    // deleteRecycle file
    var deleteRecycleController = [
      '$scope',
      '$modalInstance',
      'recycleList',
      function(
        $scope,
        $modalInstance,
        recycleList
      ) {

        $scope.ok = function() {
          angular.forEach(recycleList, function(recycle) {
            if (recycle.checked) {
              recycle.obj_type = recycle.folder ? 'folder' : 'file';
              Trash.deleteRecycle({
                obj_type: recycle.obj_type,
                obj_id: recycle.file_id
              }).$promise.then(function() {
                for (var i = 0; i < recycleList.length; ++i) {
                  if (recycleList[i].file_id == recycle.file_id) {
                    recycleList.splice(i, 1)
                    break
                  }
                }
                $scope.showEmpty = (recycleList.length == 0) ? false : true
                $rootScope.$broadcast('storage')
              }, function(error) {
                Notification.show({
                  title: '失败',
                  type: 'danger',
                  msg: error.data.result,
                  closeable: false
                })
              })
            }
          })
          $modalInstance.close()
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    //还原文件
    $scope.revertRecycle = function() {
      var revertRecycleModal = $modal.open({
        templateUrl: 'src/app/trash/revert-recycle-confim.html',
        windowClass: 'revert-recycle',
        backdrop: 'static',
        controller: revertRecycleController,
        resolve: {
          recycleList: function() {
            return $scope.recycleList
          }
        }
      })
    }

    // revertRecycle file
    var revertRecycleController = [
      '$scope',
      '$modalInstance',
      'recycleList',
      function(
        $scope,
        $modalInstance,
        recycleList
      ) {

        $scope.ok = function() {
          angular.forEach(recycleList, function(recycle) {
            if (recycle.checked) {
              recycle.obj_type = recycle.folder ? 'folder' : 'file';
              Trash.revertRecycle({}, {
                obj_type: recycle.obj_type,
                obj_id: recycle.file_id
              }).$promise.then(function() {
                for (var i = 0; i < recycleList.length; ++i) {
                  if (recycleList[i].file_id == recycle.file_id) {
                    recycleList.splice(i, 1)
                    break
                  }
                }
                $scope.showEmpty = (recycleList.length == 0) ? false : true
              }, function(error) {
                Notification.show({
                  title: '失败',
                  type: 'danger',
                  msg: error.data.result,
                  closeable: false
                })
              })
            }
          })
          $modalInstance.close()
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

  }
])