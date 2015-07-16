angular.module('App.Files').controller('App.Files.Controller', [
  '$scope',
  '$state',
  '$rootScope',
  'CONFIG',
  'Folders',
  'Users',
  'FolderAction',
  'Notification',
  'Confirm',
  'Files',
  'DownLoadFile',
  '$modal',
  '$cookies',
  '$cookieStore',
  'Utils',
  'UserDiscuss',
  '$stateParams',
  'Search',
  'Cloud',
  '$timeout',
  function(
    $scope,
    $state,
    $rootScope,
    CONFIG,
    Folders,
    Users,
    FolderAction,
    Notification,
    Confirm,
    Files,
    DownLoadFile,
    $modal,
    $cookies,
    $cookieStore,
    Utils,
    UserDiscuss,
    $stateParams,
    Search,
    Cloud,
    $timeout
  ) {
    //权限
    $scope.permission_key = CONFIG.PERMISSION_KEY
    $scope.permission_value = CONFIG.PERMISSION_VALUE

    //加载动画
    $scope.loading = true

    $scope.option = {
      isFileNull: false
    }

    //真实姓名
    $scope.realName = $cookieStore.readCookie('realName')

    $scope.cloudId = $state.params.cloudId
    $scope.is_show_folder = $state.params.is_show_folder;


    $scope.permissions = []
    angular.forEach($scope.permission_key, function(key, index) {
      var permissionMap = {
        key: key,
        value: $scope.permission_value[index]
      }
      $scope.permissions.push(permissionMap)
    })

    //Folder path 当前文件路径
    var folderId = $state.params.folderId || 0;
    $scope.folderPath = FolderAction.getFolderPath({
      folder_id: folderId
    })

    //是否为根目录
    $scope.isRoot = (folderId == 0) ? true : false

    //fileList data
    // var pageSize = 100
    //是否已经是最后页
    var is_last_page = false
    var objListPage = 1
    $scope.objList = Folders.getObjList({
      folder_id: folderId,
      page: objListPage
    })
    $scope.objList.$promise.then(function(objList) {
      $scope.loading = false
      if (objList.length <= 99) {
        is_last_page = true
      }
      refreshList()
      if ($state.params.file_id) { //选中文件（如果有）
        var obj = ''
        var has_find = false //是否在当前列表中发现此文件

        for (var i = 0; i < $scope.objList.length; i++) {
          if ($scope.objList[i].file_id == $state.params.file_id) {
            obj = $scope.objList[i]
            $scope.objList[i].checked = true
            has_find = true
            break;
          }
        }

        if (!has_find) { //当前列表中没有找到文件
          Files.view({
            file_id: $state.params.file_id
          }).$promise.then(function(file) {
            obj = file
            obj.has_link = (file.link_id != 0) ? true : false
          })
        }

        if($scope.is_show_folder == 1){
          //打开评论框
          var discuss_file = {
            file_name : obj.file_name,
            folder_id : obj.folder_id,
            file_id : obj.file_id,
            permission : obj.permission,
            version_count : obj.version_count,
            discuss_count : obj.discuss_count
          }
          var is_preview = discuss_file.permission.substring(4, 5) //预览权限
          var is_download = discuss_file.permission.substring(5, 6) //下载权限
          discuss_file.is_preview = (is_preview == '1') ? true : false
          discuss_file.is_download = (is_download == '1') ? true : false          
          //对象是否能被预览
          var fileType = Utils.getFileTypeByName(discuss_file.file_name || discuss_file.folder_name)
          discuss_file.isPreview = (fileType && discuss_file.is_preview) ? true : false

          $scope.openUserDiscuss(null, discuss_file, true);
        }
        else{
          //打开文件预览
          var previewFileModal = $modal.open({
            templateUrl: 'src/app/files/preview-file/template.html',
            windowClass: 'preview-file',
            backdrop: 'static',
            controller: 'App.Files.PreviewFileController',
            resolve: {
              obj: function() {
                return obj
              },
              fileVersionPreview: function() {
                return '';
              },
              objList: function() {
                return $scope.objList;
              }
            }
          })
        }

      }

    }, function(error) {
      Notification.show({
        title: '失败',
        type: 'danger',
        msg: error.data.result,
        closeable: false
      })
      $timeout(function() {
        history.go(-1)
      }, 4000)
    })

    $scope.onFileListScroll = function(scrollTop, scrollHeight) {
      if (scrollTop == scrollHeight && !$scope.loading && !is_last_page) {
        objListPage++
        $scope.loading = true
        var objList = Folders.getObjList({
          folder_id: folderId,
          page: objListPage
        })
        objList.$promise.then(function() {
          if (objList.length <= 99) {
            is_last_page = true
          }
          $scope.loading = false
          for (var i = 0; i < objList.length; i++) {
            $scope.objList.push(objList[i]);
          }
          refreshList()

          $scope.show_dele_btn = false
          $scope.selectedAll = false

        })
      }
    }

    //根目录(当前目录)下按钮权限
    $scope.folder_owner = false
    $scope.folder_delete = false
    $scope.folder_edit = false
    $scope.folder_getLink = false
    $scope.folder_preview = false
    $scope.folder_download = false
    $scope.folder_upload = false

    //当前目录下权限
    $scope.$on('folder_permission', function($event, folder_permission) {
      var folder_owner = folder_permission.substring(0, 1) //协同拥有者 or 拥有者1
      var folder_delete = folder_permission.substring(1, 2) //删除权限
      var folder_edit = folder_permission.substring(2, 3) //编辑权限
      var folder_getLink = folder_permission.substring(3, 4) //链接权限
      var folder_preview = folder_permission.substring(4, 5) //预览权限
      var folder_download = folder_permission.substring(5, 6) //下载权限
      var folder_upload = folder_permission.substring(6, 7) //上传权限
        //权限列表
      $scope.folder_owner = (folder_owner == '1') ? true : false
      $scope.folder_delete = (folder_delete == '1') ? true : false
      $scope.folder_edit = (folder_edit == '1') ? true : false
      $scope.folder_getLink = (folder_getLink == '1') ? true : false
      $scope.folder_preview = (folder_preview == '1') ? true : false
      $scope.folder_download = (folder_download == '1') ? true : false
      $scope.folder_upload = (folder_upload == '1') ? true : false
    })

    $scope.$on('uploadFilesDone', function() {
      $scope.loading = true;
      $scope.objList = Folders.getObjList({
        folder_id: folderId
      })
      $scope.objList.$promise.then(function() {
        refreshList();
        //更新空间
        $rootScope.$broadcast('storage');
        //      Notification.show({
        //        title: '成功',
        //        type: 'success',
        //        msg: '上传文件成功',
        //        closeable: true
        //      })
      })
    })

    // 删除,移动或复制时刷新文件列表
    function refreshFileList() {
      objListPage = 1;
      $scope.loading = true
      var objList = Folders.getObjList({
        folder_id: folderId,
        page: objListPage
      })
      objList.$promise.then(function() {
        $scope.objList.length = 0; //清空list
        if (objList.length <= 99) {
          is_last_page = true
        }
        $scope.loading = false
        for (var i = 0; i < objList.length; i++) {
          $scope.objList.push(objList[i]);
        }
        refreshList()

        $scope.show_dele_btn = false
        $scope.selectedAll = false

      })
    }

    //渲染文件列表
    function refreshList() {      
      $scope.loading = false;      
      $scope.option.isFileNull = ($scope.objList.length == 0);
      angular.forEach($scope.objList, function(obj) {
        //权限列表
        var is_owner = obj.permission.substring(0, 1) //协同拥有者 or 拥有者1
        var is_delete = obj.permission.substring(1, 2) //删除权限
        var is_edit = obj.permission.substring(2, 3) //编辑权限
        var is_getLink = obj.permission.substring(3, 4) //链接权限
        var is_preview = obj.permission.substring(4, 5) //预览权限
        var is_download = obj.permission.substring(5, 6) //下载权限
        var is_upload = obj.permission.substring(6, 7) //上传权限

        obj.is_owner = (is_owner == '1') ? true : false
        obj.is_delete = (is_delete == '1') ? true : false
        obj.is_edit = (is_edit == '1') ? true : false
        obj.is_getLink = (is_getLink == '1') ? true : false
        obj.is_preview = (is_preview == '1') ? true : false
        obj.is_download = (is_download == '1') ? true : false
        obj.is_upload = (is_upload == '1') ? true : false

        //对象是否被选中
        obj.checked = false
        //对象是否显示重名输入框
        obj.rename = false

        //对象是否是文件夹
        obj.folder = (obj.isFolder == 1) ? true : false

        //链接协作toptip text
        obj.linkText = (obj.link_id != 0) ? 'LANG_FILE_VIEW_LINK' : 'LANG_FILE_GENERATE_LINK'
        obj.has_link = (obj.link_id != 0) ? true : false

        //对象是否能被预览
        var fileType = Utils.getFileTypeByName(obj.file_name || obj.folder_name)
        obj.isPreview = (fileType && obj.is_preview) ? true : false
        obj.isNote = (fileType == 'note') ? true : false

        //文件图像
        if (obj.isFolder == 1) { //文件夹
          if (obj.isShared == 1) {
            obj.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small_share;
            obj.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large_share;
          } else {
            obj.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small;
            obj.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large;
          }
        } else if (fileType == 'image') { //图片缩略图
          obj.smallIcon = CONFIG.API_ROOT + '/file/preview/' + obj.file_id + '?token=' + $cookies.token + '&size=48' + '&_=' + new Date().getTime();
        } else {
          var ext;
          if (obj.isFolder == 1) {
            ext = 'folder';
          } else {
            ext = obj.file_name.slice(obj.file_name.lastIndexOf('.') + 1);
          }
          var icon = Utils.getIconByExtension(ext);
          obj.smallIcon = icon.small;
          obj.largeIcon = icon.large;
        }

        //文件权限
        angular.forEach($scope.permission_key, function(key, index) {
          if (obj.owner_uid == $cookies.userId) { //拥有者
            obj.permission_value = obj.isShared == 1 ? 'OWNER_PERMISSION_VALUE' : '----'
          } else {
            if (key == obj.permission) {
              obj.permission_value = $scope.permission_value[index]
            }
          }
        })

      })
      $scope.objList.$promise.then(function(objList) {
        $rootScope.$broadcast('objList', objList)
      })
      
    }

    //全部选择状态
    $scope.selectedAll = false

    $scope.selectedAllswitch = function() {
      angular.forEach($scope.objList, function(obj) {
        obj.checked = !$scope.selectedAll
      })
      if (!$scope.selectedAll && $scope.objList.length != 0) {
        $scope.show_dele_btn = true
      } else {
        $scope.show_dele_btn = false
      }
    }

    //新建文件夹
    $scope.createFolderData = {
      createFolderName: '',
      myInputFocus: false
    }
    $scope.showCreateFolderDiv = false
    $scope.showCreateFolder = function() {
      $scope.createFolderData.createFolderName = ''
      $scope.showCreateFolderDiv = !$scope.showCreateFolderDiv
      $scope.createFolderData.myInputFocus = !$scope.createFolderData.myInputFocus;
    }
    $scope.cancelCreate = function() {
      $scope.showCreateFolderDiv = !$scope.showCreateFolderDiv
    }
    $scope.createFolder = function(createFolderName) {
      if (createFolderName.length == 0) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: 'LANG_FILES_FOLDER_NAME_NOT_NULL',
          closeable: false
        })
        return;
      }
      if (createFolderName.length >= 200) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: 'LANG_FILES_FOLDER_NAME_NOT_MORE_THAN_200',
          closeable: false
        })
        return
      }
      //特殊字符正则表达式
      var txt = new RegExp("[\\\\,\\:,\\*,\\/,\\?,\",\\<,\\>,\\|]")

      if (txt.test(createFolderName)) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: 'LANG_FILES_FOLDER_NAME_CONTAIN_SPENCIAL_CHARACTERS',
          closeable: false
        })
        return
      }
      FolderAction.createFolder({
        folder_name: createFolderName,
        parent_id: folderId
      }).$promise.then(function(reFolder) {
        $scope.loading = true;
        $scope.objList = Folders.getObjList({
          folder_id: folderId
        })
        $scope.objList.$promise.then(function() {
          refreshList();
          Notification.show({
            title: '成功',
            type: 'success',
            msg: 'LANG_FILES_CREATE_FOLDER_SUCCESS_MESSAGE',
            closeable: true
          })
        })
      }, function(error) {
        $scope.loading = false;
        if(!Utils.isReturnErrorDetails(error)){
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: 'LANG_FILES_CREATE_FOLDER_ERROR_MESSAGE',
            closeable: false
          })
        }
      })
      $scope.showCreateFolderDiv = !$scope.showCreateFolderDiv
    }

    //批量删除
    $scope.deleteObjList = function() {
      var deleteLsit = {
        file_ids: [],
        folder_ids: []
      }
      angular.forEach($scope.objList, function(obj) {
        if (obj.checked == true) {
          if (obj.isFolder == 1) {
            deleteLsit.folder_ids.push(obj.folder_id)
          } else {
            deleteLsit.file_ids.push(obj.file_id)
          }
        }
      })

      var deleteObjListModal = $modal.open({
        templateUrl: 'src/app/files/delete-file-confirm.html',
        windowClass: 'delete-file',
        backdrop: 'static',
        controller: deleteObjListController,
        resolve: {
          objList: function() {
            return $scope.objList
          },
          deleteLsit: function() {
            return deleteLsit
          },
          show_dele_btn: function() {
            return $scope.show_dele_btn
          }
        }
      })

      deleteObjListModal.result.then(function(is_delete_success) {
        if (is_delete_success) {
          refreshFileList(); //成功删除刷新列表
        }
      })

    }

    var deleteObjListController = [
      '$scope',
      '$modalInstance',
      'objList',
      'deleteLsit',
      function(
        $scope,
        $modalInstance,
        objList,
        deleteLsit
      ) {

        $scope.objList = objList

        $scope.ok = function() {
          Files.deleteFileList({

          }, {
            file_ids: deleteLsit.file_ids,
            folder_ids: deleteLsit.folder_ids
          }).$promise.then(function() {
            // for (var i = 0; i < deleteLsit.file_ids.length; i++) {
            //  for (var j = 0; j < $scope.objList.length; ++j) {
            //    if ($scope.objList[j].file_id == deleteLsit.file_ids[i]) {
            //      $scope.objList.splice(j, 1)
            //      break
            //    }
            //  }
            // }

            // for (var i = 0; i < deleteLsit.folder_ids.length; i++) {
            //  for (var j = 0; j < $scope.objList.length; ++j) {
            //    if ($scope.objList[j].folder_id == deleteLsit.folder_ids[i]) {
            //      $scope.objList.splice(j, 1)
            //      break
            //    }
            //  }
            // }

            Notification.show({
              title: '成功',
              type: 'success',
              msg: 'LANG_FILE_DELETE_SUCCESS_MESSAGE',
              param: deleteLsit.file_ids.length + deleteLsit.folder_ids.length,
              closeable: true
            })

            $modalInstance.close(true)

          }, function(error) {
            if(!Utils.isReturnErrorDetails(error)){
              Notification.show({
                title: '失败',
                type: 'danger',
                msg: 'LANG_FILE_DELETE_ERROR_MESSAGE',
                closeable: false
              })
            }
            $modalInstance.close(false)
          })
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]


    //批量移动
    $scope.removeObjList = function() {
      var moveList = {
        file_ids: [],
        folder_ids: []
      }
      var parentIdList = [];
      angular.forEach($scope.objList, function(obj) {
        if (obj.checked == true) {
          if (obj.isFolder == 1) {
            moveList.folder_ids.push(obj.folder_id);
            parentIdList.push(obj.parent_id);
          } else {
            moveList.file_ids.push(obj.file_id)
            parentIdList.push(obj.folder_id);
          }
        }
      })

      var moveListModal = $modal.open({
        templateUrl: 'src/app/files/move-file/template.html',
        windowClass: 'move-file-modal-view',
        backdrop: 'static',
        controller: 'App.Files.MoveFileController',
        resolve: {
          obj: function() {
            return null
          },
          moveList: function() {
            return moveList
          },
          parentIdList: function() {
            return parentIdList
          }
        }
      })

      moveListModal.result.then(function(moveResponse) {
        var moveListResponse = moveResponse.moveListResponse;
        var moveFolderName = moveResponse.moveFolderName;
        $scope.show_dele_btn = false
        $scope.selectedAll = false
        // if (moveListResponse.success_list.folders.length != 0 || moveListResponse.success_list.files.length != 0) {
        //  for (var i = 0; i < moveListResponse.success_list.files.length; i++) {
        //    for (var j = 0; j < $scope.objList.length; ++j) {
        //      if ($scope.objList[j].file_id == moveListResponse.success_list.files[i].file_id) {
        //        $scope.objList.splice(j, 1)
        //        break
        //      }
        //    }
        //  }

        //  for (var i = 0; i < moveListResponse.success_list.folders.length; i++) {
        //    for (var j = 0; j < $scope.objList.length; ++j) {
        //      if ($scope.objList[j].folder_id == moveListResponse.success_list.folders[i].folder_id) {
        //        $scope.objList.splice(j, 1)
        //        break
        //      }
        //    }
        //  }
        // }

        if (moveListResponse.failed_list.folders.length == 0 && moveListResponse.failed_list.files.length == 0) {
          refreshFileList();
          Notification.show({
            title: '成功',
            type: 'success',
            msg: 'LANG_FILE_MOVE_SUCCESS_MESSAGE',
            param: moveListResponse.success_list.files.length + moveListResponse.success_list.folders.length,
            param1: moveFolderName,
            closeable: true
          })
        } else {
          $scope.show_dele_btn = true
          var errorMsg = ''
          if (moveListResponse.failed_list.folders.length != 0) {
            for (var i = 0; i < moveListResponse.failed_list.folders.length; i++) {
              errorMsg = errorMsg + moveListResponse.failed_list.folders[i].folder_name + ','
            }
          }

          if (moveListResponse.failed_list.files.length != 0) {
            for (var i = 0; i < moveListResponse.failed_list.files.length; i++) {
              errorMsg = errorMsg + moveListResponse.failed_list.files[i].file_name + ' '
            }
          }

          Notification.show({
            title: '失败',
            type: 'warning',
            msg: 'LANG_MOVE_FILES_SAME_NAME_FILE',
            errorMsg: errorMsg,
            closeable: true
          })
        }
      })
    }

    //批量复制
    $scope.copyObjList = function() {
      $scope.space_info = Users.getSpaceinfo()
      $scope.space_info.$promise.then(function(user_space) {
        var user_total_size = user_space.total_size;
        var user_used_size = user_space.used_size;
        $scope.user_unused_size = user_total_size - user_used_size;

        if ($scope.user_unused_size > 0) {
          var copyList = {
            file_ids: [],
            folder_ids: []
          }
          var files_total_size = 0;
          angular.forEach($scope.objList, function(obj) {
            if (obj.checked == true) {
              if (obj.isFolder == 1) {
                copyList.folder_ids.push(obj.folder_id);
                files_total_size += parseInt(obj.folder_size);
              } else {
                copyList.file_ids.push(obj.file_id);
                files_total_size += parseInt(obj.file_size);
              }
            }
          });

          if($scope.user_unused_size > files_total_size) {            
            var copyListModal = $modal.open({
              templateUrl: 'src/app/files/copy-file/template.html',
              windowClass: 'copy-file-modal-view',
              backdrop: 'static',
              controller: 'App.Files.CopyFileController',
              resolve: {
                obj: function() {
                  return null
                },
                copyList: function() {
                  return copyList
                }
              }
            })

            copyListModal.result.then(function(copyResponse) {
              var copyListResponse = copyResponse.copyListResponse;
              var copyFolderName = copyResponse.copyFolderName;
              if (copyListResponse.failed_list.folders.length == 0 && copyListResponse.failed_list.files.length == 0) {
                refreshFileList();
                Notification.show({
                  title: '成功',
                  type: 'success',
                  msg: 'LANG_FILE_COPY_SUCCESS_MESSAGE',
                  param: copyListResponse.success_list.folders.length + copyListResponse.success_list.files.length,
                  param1: copyFolderName,
                  closeable: true
                });
              } else {
                $scope.show_dele_btn = true
                var errorMsg = ''
                if (copyListResponse.failed_list.folders.length != 0) {
                  for (var i = 0; i < copyListResponse.failed_list.folders.length; i++) {
                    errorMsg = errorMsg + copyListResponse.failed_list.folders[i].folder_name + ','
                  }
                }

                if (copyListResponse.failed_list.files.length != 0) {
                  for (var i = 0; i < copyListResponse.failed_list.files.length; i++) {
                    errorMsg = errorMsg + copyListResponse.failed_list.files[i].file_name + ' '
                  }
                }

                Notification.show({
                  title: '失败',
                  type: 'warning',
                  msg: 'LANG_MOVE_FILES_SAME_NAME_FILE',
                  errorMsg: errorMsg,
                  closeable: true
                })
              }
              $rootScope.$broadcast('storage')
            });
          } else {
            Notification.show({
              title: '复制失败',
              type: 'danger',
              msg: 'LANG_FILES_NO_SPACE_MESSAGE',
              closeable: false
            });  
          }
        } else {
          Notification.show({
            title: '复制失败',
            type: 'danger',
            msg: 'LANG_FILES_NO_SPACE_MESSAGE',
            closeable: false
          });  
        }
      });
    }

    //左键选取对象
    $scope.selectObj = function($event, obj) {
      //    $event.stopPropagation()
      obj.checked = !obj.checked
      $scope.show_dele_btn = false
      $scope.selectedAll = true
      angular.forEach($scope.objList, function(obj) {
        if (obj.checked == true) {
          $scope.show_dele_btn = true
        }
        if (obj.checked == false) {
          $scope.selectedAll = false
        }
      })
    }

    //左键选取checkBox
    $scope.selectCheck = function($event, obj) {
      $event.stopPropagation()
      obj.checked = !obj.checked
      $scope.show_dele_btn = false
      $scope.selectedAll = true
      angular.forEach($scope.objList, function(obj) {
        if (obj.checked == true) {
          $scope.show_dele_btn = true
        }
        if (obj.checked == false) {
          $scope.selectedAll = false
        }
      })
    }

    //右键菜单
    $scope.onRightClick = function(obj) {
      var obj_permission = obj.permission;
      var obj_owner = obj_permission.substring(0, 1) //协同拥有者 or 拥有者1
      var obj_delete = obj_permission.substring(1, 2) //删除权限
      var obj_edit = obj_permission.substring(2, 3) //编辑权限
      var obj_getLink = obj_permission.substring(3, 4) //链接权限
      var obj_preview = obj_permission.substring(4, 5) //预览权限
      var obj_download = obj_permission.substring(5, 6) //下载权限
      var obj_upload = obj_permission.substring(6, 7) //上传权限
        //权限列表
      var obj_owner = (obj_owner == '1') ? true : false
      var obj_delete = (obj_delete == '1') ? true : false
      var obj_edit = (obj_edit == '1') ? true : false
      var obj_getLink = (obj_getLink == '1') ? true : false
      var obj_preview = (obj_preview == '1') ? true : false
      var obj_download = (obj_download == '1') ? true : false
      var obj_upload = (obj_upload == '1') ? true : false

      //设置同步或者取消同步
      $scope.syncText = (obj.isSynced == 0) ? 'LANG_SET_SYNC' : 'LANG_CANCEL_SYNC'

      //权限判断
      if (obj.owner_uid == $cookies.userId) { //拥有者
        $scope.show_delete_menu = true
        $scope.show_rename_menu = true
        $scope.show_remove_menu = true
        $scope.show_add_tag_menu = true
      } else {
        if (obj_delete && obj.isShareObj == 0) {
          $scope.show_delete_menu = true
          $scope.show_rename_menu = true
          $scope.show_remove_menu = true
        } else {
          $scope.show_delete_menu = false
          $scope.show_rename_menu = false
          $scope.show_remove_menu = false
        }
        $scope.show_add_tag_menu = obj_delete;
      }

      if (obj.isFolder == 1) {
        $scope.show_discuss_menu = false
        if (obj.isShared == 1 && obj.owner_uid != $cookies.userId) {
          $scope.show_quit_menu = true
        } else {
          $scope.show_quit_menu = false
        }
        $scope.show_download_menu = (obj_download) ? true : false //下载菜单
        $scope.show_sync_menu = (obj.isSyncObj == obj.isSynced && obj_edit) ? true : false //同步菜单
        $scope.show_upload_menu = false //上传新版本
      } else {
        $scope.show_quit_menu = false
        $scope.show_discuss_menu = (obj_preview) ? true : false //讨论菜单
        var fileType = Utils.getFileTypeByName(obj.file_name)
        $scope.show_download_menu = (obj_download && fileType != 'note') ? true : false //下载菜单
        $scope.show_sync_menu = false //同步菜单
        $scope.show_upload_menu = (obj_edit) ? true : false //上传新版本
      }

      //取消所有选中状态
      angular.forEach($scope.objList, function(obj) {
        obj.checked = false
      })
      //右键对象选中
      obj.checked = true
      //全选取消
      $scope.selectedAll = false
      for (var i = 0; i < $scope.objList.length; ++i) {
        if ($scope.objList[i].checked == true)
          break
      }
      $scope.checkedObj = $scope.objList[i]
    }

    //右键选中的文件
    $scope.checkedObj = ''

    //删除单个文件或者文件夹(右键删除)
    $scope.deleteObj = function() {
      var deleteObjModal = $modal.open({
        templateUrl: 'src/app/files/delete-file-confirm.html',
        windowClass: 'delete-file',
        backdrop: 'static',
        controller: deleteObjController,
        resolve: {
          objList: function() {
            return $scope.objList
          },
          option: function() {
            return $scope.option
          }
        }
      })
    }

    // deleteObj file
    var deleteObjController = [
      '$scope',
      '$modalInstance',
      'objList',
      'option',
      function(
        $scope,
        $modalInstance,
        objList,
        option
      ) {
        $scope.objList = objList
        $scope.ok = function() {
          for (var i = 0; i < $scope.objList.length; ++i) {
            if ($scope.objList[i].checked == true)
              break
          }
          if ($scope.objList[i].isFolder == 1) { //文件夹
            FolderAction.deleteFolder({
              folder_id: $scope.objList[i].folder_id
            }).$promise.then(function() {
              $scope.objList.splice(i, 1)
              option.isFileNull = ($scope.objList.length == 0);
              Notification.show({
                title: '成功',
                type: 'success',
                msg: 'LANG_FILE_DELETE_SUCCESS_MESSAGE',
                param: 1,
                closeable: true
              })
            }, function(error) {
              if(!Utils.isReturnErrorDetails(error)){
                Notification.show({
                  title: '失败',
                  type: 'danger',
                  msg: 'LANG_FILE_DELETE_ERROR_MESSAGE',
                  closeable: false
                })
              }
            })
          } else { //文件
            Files.deleteFile({
              file_id: $scope.objList[i].file_id
            }).$promise.then(function() {
              $scope.objList.splice(i, 1)
              option.isFileNull = ($scope.objList.length == 0);
              Notification.show({
                title: '成功',
                type: 'success',
                msg: 'LANG_FILES_DELETE_FILE_SUCCESS_MESSAGE',
                closeable: true
              })
            }, function(error) {
              if(!Utils.isReturnErrorDetails(error)){
                Notification.show({
                  title: '失败',
                  type: 'danger',
                  msg: 'LANG_FILE_DELETE_ERROR_MESSAGE',
                  closeable: false
                })
              }
            })
          }
          $modalInstance.close()
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    //退出协作
    $scope.quitTeam = function() {
      var quitTeamModal = $modal.open({
        templateUrl: 'src/app/files/quit-team-confirm.html',
        windowClass: 'quit-team',
        backdrop: 'static',
        controller: quitTeamController,
        resolve: {
          objList: function() {
            return $scope.objList
          }
        }
      })
    }

    // quitTeam
    var quitTeamController = [
      '$scope',
      '$modalInstance',
      'objList',
      function(
        $scope,
        $modalInstance,
        objList
      ) {

        $scope.objList = objList
        $scope.ok = function() {
          for (var i = 0; i < $scope.objList.length; ++i) {
            if ($scope.objList[i].checked == true)
              break
          }
          FolderAction.quit({
            folder_id: $scope.objList[i].folder_id
          }, {

          }).$promise.then(function() {
            $scope.objList.splice(i, 1)
            Notification.show({
              title: '成功',
              type: 'success',
              msg: 'LANG_FILES_QUIT_COLLABORATION_MESSAGE',
              closeable: true
            })
          }, function(error) {
            Notification.show({
              title: '失败',
              type: 'danger',
              msg: error.data.result,
              closeable: false
            })
          })

          $modalInstance.close()
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    //下载单个文件(夹) 文件夹为打包下载
    $scope.downloadFile = function(checkedObj) {
      Notification.show({
        title: '成功',
        type: 'success',
        msg: '正在准备下载…',
        closeable: false
      })
      var hiddenIframeID = 'hiddenDownloader'
      var iframe = $('#' + hiddenIframeID)[0]
      if (iframe == null) {
        iframe = document.createElement('iframe')
        iframe.id = hiddenIframeID
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      }
      if (checkedObj.file_id) { //文件下载
        iframe.src = CONFIG.API_ROOT + '/file/get/' + checkedObj.file_id + '?token=' + $cookies.token + '&cloud_id=' + $state.params.cloudId
      } else { //文件夹下载
        iframe.src = CONFIG.API_ROOT + '/folder/getZip/' + checkedObj.folder_id + '?token=' + $cookies.token + '&cloud_id=' + $state.params.cloudId
      }
    }

    //下载多个文件(夹) 文件夹为打包下载
    $scope.downloadZip = function() {
      Notification.show({
        title: '成功',
        type: 'success',
        msg: '正在准备下载…',
        closeable: false
      })
      var downloadLsit = {
        file_ids: [],
        folder_ids: []
      }
      var is_download = true;
      var failed_list = [];
      angular.forEach($scope.objList, function(obj) {
        if (obj.checked == true) {
          if(!obj.is_download) {
            is_download = false;
            failed_list.push(obj.file_name || obj.folder_name);
          } else if (obj.isFolder == 1) {
            downloadLsit.folder_ids.push(obj.folder_id)
          } else {
            downloadLsit.file_ids.push(obj.file_id)
          }
        }
      })
      if(is_download) {
        var hiddenIframeID = 'hiddenDownloader'
        var iframe = $('#' + hiddenIframeID)[0]
        if (iframe == null) {
          iframe = document.createElement('iframe')
          iframe.id = hiddenIframeID
          iframe.style.display = 'none'
          document.body.appendChild(iframe)
        }
        if (downloadLsit.file_ids.length == 1 && downloadLsit.folder_ids.length == 0) { //单个文件下载
          iframe.src = CONFIG.API_ROOT + '/file/get/' + downloadLsit.file_ids[0] + '?token=' + $cookies.token + '&cloud_id=' + $state.params.cloudId
        } else if (downloadLsit.folder_ids.length == 1 && downloadLsit.file_ids.length == 0) { //单个文件夹下载
          iframe.src = CONFIG.API_ROOT + '/folder/getZip/' + downloadLsit.folder_ids[0] + '?token=' + $cookies.token + '&cloud_id=' + $state.params.cloudId
        } else {//多个文件或者文件夹下载
          iframe.src = CONFIG.API_ROOT + '/folder/getZip?obj_ids=' + angular.toJson(downloadLsit) + '&token=' + $cookies.token + '&cloud_id=' + $state.params.cloudId
        }
      } else {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: '您没有对 ' + failed_list.join(', ') + ' 的下载权限',
          closeable: false
        })
      }
    }

    //重命名文件或文件夹
    $scope.renameInputValue = ""
    $scope.renameFileForm = function() {
      $scope.checkedObj.focus = true
      $scope.checkedObj.rename = true
      if ($scope.checkedObj.isFolder == 1) { //文件夹
        $scope.checkedObj.renameInputValue = $scope.checkedObj.folder_name
      } else {
        var file_name = $scope.checkedObj.file_name
          //获取后缀名
        var extStart = file_name.lastIndexOf(".")
        var ext = file_name.substring(extStart, file_name.length)
        $scope.checkedObj.renameInputValue = file_name.substring(0, extStart)
      }
    }

    $scope.renameFile = function($event, obj) {
      if ($event) {
        $event.stopPropagation()
      }

      if (obj.renameInputValue.length >= 200) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: '文件（夹）名不能超过200个字符',
          closeable: false
        })
        return
      }

      //特殊字符正则表达式
      var txt = new RegExp("[\\\\,\\:,\\*,\\/,\\?,\",\\<,\\>,\\|]")
      if (txt.test(obj.renameInputValue)) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: '文件名不允许含有特殊字符\\ / : * ? " < > |',
          closeable: false
        })
        return
      }
      if (obj.renameInputValue.replace(/^\s+|\s+$/g, "") == '') {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: 'LANG_FILES_EMPTY_FOLDER_MESSAGE',
          closeable: false
        })
        return
      }
      if (obj.isFolder == 1) { //文件夹
        FolderAction.updateFolder({
          folder_id: obj.folder_id
        }, {
          folder_name: obj.renameInputValue
        }).$promise.then(function() {
          obj.folder_name = obj.renameInputValue
          obj.rename = false
          Notification.show({
            title: '成功',
            type: 'success',
            msg: '重命名已完成',
            closeable: true
          })

        }, function(error) {
          if(!Utils.isReturnErrorDetails(error)){
            Notification.show({
              title: '失败',
              type: 'danger',
              msg: '重命名时遇到了问题，请再试一次',
              closeable: false
            })
          }
        })
      } else {
        var file_name = obj.file_name
          //获取后缀名
        var extStart = file_name.lastIndexOf(".")
        var ext = file_name.substring(extStart, file_name.length)
        Files.updateFile({
          file_id: obj.file_id
        }, {
          file_name: obj.renameInputValue + ext
        }).$promise.then(function() {
          obj.file_name = obj.renameInputValue + ext
          obj.rename = false;
          Notification.show({
            title: '成功',
            type: 'success',
            msg: '重命名已完成',
            closeable: true
          })
        }, function(error) {
          if(!Utils.isReturnErrorDetails(error)){
            Notification.show({
              title: '失败',
              type: 'danger',
              msg: '重命名时遇到了问题，请再试一次',
              closeable: false
            })
          }
        })
      }
    }

    $scope.cancelRenameFile = function($event, obj) {
      $event.stopPropagation()
      obj.rename = false
    }


    //移动文件或者文件夹
    $scope.moveFile = function() {
      var parentIdList = [];
      if ($scope.checkedObj.isFolder == 1) {
        parentIdList.push($scope.checkedObj.parent_id);
      } else {
        parentIdList.push($scope.checkedObj.folder_id);
      }
      var moveModal = $modal.open({
        templateUrl: 'src/app/files/move-file/template.html',
        windowClass: 'move-file-modal-view',
        backdrop: 'static',
        controller: 'App.Files.MoveFileController',
        resolve: {
          obj: function() {
            return $scope.checkedObj
          },
          moveList: function() {
            return []
          },
          parentIdList: function() {
            return parentIdList
          }
        }
      })

      moveModal.result.then(function(moveResponse) {
        var file_id = moveResponse.file_id;
        var moveFolderName = moveResponse.moveFolderName;
        for (var i = 0; i < $scope.objList.length; ++i) {
          if ($scope.objList[i].folder_id == file_id || $scope.objList[i].file_id == file_id) {
            $scope.objList.splice(i, 1)
            break
          }
        }

        $scope.option.isFileNull = ($scope.objList.length == 0);

        Notification.show({
          title: '成功',
          type: 'success',
          msg: 'LANG_FILE_MOVE_SUCCESS_MESSAGE',
          param: 1,
          param1: moveFolderName,
          closeable: true
        })
      })
    }

    // 打开讨论 默认是关闭的
    $scope.openUserDiscuss = function($event, obj, right) {
      if (!right) { //是否是右键菜单的操作
        $event.stopPropagation()
      }
      if (!obj.is_preview) { //讨论权限
        return
      }
      $rootScope.$broadcast('discuss_file', obj, 'dis', $scope.objList);
    }

    // 打开版本 默认是关闭的
    $scope.openFileVersion = function($event, obj, right) {
      if (!right) { //是否是右键菜单的操作
        $event.stopPropagation()
      }
      if (!obj.is_preview) { //讨论权限
        return
      }
      $rootScope.$broadcast('discuss_file', obj, 'ver', $scope.objList);
    }

    $scope.stopPropagation = function($event, obj) {
      $event.stopPropagation()
      obj.checked = !obj.checked
    }

    //邀请协作人
    $scope.inviteTeamUsers = function($event, obj) {
      $event.stopPropagation()
      if (!obj.is_edit) { //无编辑权限
        return
      }
      var addUserModal = $modal.open({
        templateUrl: 'src/app/files/invite-team-users/template.html',
        windowClass: 'invite-team-users',
        backdrop: 'static',
        controller: 'App.Files.InviteTeamUsersController',
        resolve: {
          folder_id: function() {
            return obj.folder_id
          },
          folder_name: function() {
            return obj.folder_name
          },
          folder_permission: function() {
            return obj.permission
          },
          obj: function() {
            return obj
          }
        }
      })
    }

    //链接分享
    $scope.linkShare = function($event, obj) {
      $event.stopPropagation()
      if (!obj.is_getLink) { //无编辑权限
        return
      }
      var linkShareModal = $modal.open({
        templateUrl: 'src/app/files/link-share/template.html',
        windowClass: 'link-share',
        backdrop: 'static',
        controller: 'App.Files.LinkShareController',
        resolve: {
          obj: function() {
            return obj
          }
        }
      })

    }

    // upload file
    var uploadModalController = [
      '$scope',
      '$modalInstance',
      '$cookies',
      '$state',
      function(
        $scope,
        $modalInstance,
        $cookies,
        $state
      ) {
        $scope.multiple = true

        $scope.onFileSelect = function($files) {
          $modalInstance.close($files)
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    //上传
    $scope.upload = function() {
      $scope.space_info = Users.getSpaceinfo()
      $scope.space_info.$promise.then(function(user_space) {
        var user_total_size = user_space.total_size;
        var user_used_size = user_space.used_size;
        $scope.user_unused_size = user_total_size - user_used_size;

        if ($scope.user_unused_size > 0) {
          var uploadModal = $modal.open({
            templateUrl: 'src/app/files/modal-upload.html',
            windowClass: 'modal-upload',
            backdrop: 'static',
            controller: uploadModalController,
            resolve: {}
          })
          uploadModal.result.then(function(files) {
            var $files = [];
            var files_total_size = 0;
            var upload_erro = (CONFIG.UPLOAD_FILE_SIZE == 1024 * 1024 * 1024) ? 'LANG_FILES_NOT_MORE_THAN_1G' : 'LANG_FILES_NOT_MORE_THAN_5G'
            for (var i = 0; i < files.length; i++) {
              if (files[i].size > CONFIG.UPLOAD_FILE_SIZE) { //文件大小不能大于1G
                Notification.show({
                  title: '失败',
                  type: 'danger',
                  msg: upload_erro,
                  closeable: false
                })
              } else {
                var fileType = Utils.getFileTypeByName(files[i].name)
                if (fileType == 'note') {
                  Notification.show({
                    title: '失败',
                    type: 'danger',
                    msg: 'LANG_UPLOAD_TYPE_LIMIT',
                    closeable: false
                  })
                } else {
                  $files.push(files[i]);
                  files_total_size += files[i].size;
                }
              }

            }
            var contain_same_file = false;
            $scope.objList.forEach(function(obj) {
              $files.forEach(function(upload_file) {
                //查看上传文件是否有同名文件                
                if (!obj.folder && (obj.file_name.toLowerCase() == upload_file.name.toLowerCase()) && !contain_same_file) {
                  var ext;
                  ext = upload_file.name.slice(obj.file_name.lastIndexOf('.') + 1);
                  var icon = Utils.getIconByExtension(ext);
                  var smallIcon = icon.small;
                  contain_same_file = true;
                  Confirm.show({
                    title: 'LANG_FILES_CONFIRM',
                    complexContent: {
                      img: smallIcon,
                      name: upload_file.name
                    },
                    content: 'LANG_FILES_OVERLAP_CONFIRM',
                    okButtonContent: '覆盖',
                    extraButtonContent: '都保留',
                    extraButtonClick: function($modalInstance) {
                      $modalInstance.dismiss('cancel');
                      if (files_total_size > $scope.user_unused_size) {
                        Notification.show({
                          title: '上传失败',
                          type: 'danger',
                          msg: 'LANG_FILES_NO_SPACE_MESSAGE',
                          closeable: false
                        })
                      } else if ($files.length != 0) {
                        $rootScope.$broadcast('uploadFiles', $files, true);
                      }
                    },
                    ok: function($modalInstance) {
                      $modalInstance.dismiss('cancel');
                      if (files_total_size > $scope.user_unused_size) {
                        Notification.show({
                          title: '上传失败',
                          type: 'danger',
                          msg: 'LANG_FILES_NO_SPACE_MESSAGE',
                          closeable: false
                        })
                      } else if ($files.length != 0) {
                        $rootScope.$broadcast('uploadFiles', $files);
                      }
                    }
                  });

                }
              });
            });
            // 上传文件的大小超过用户的剩余空间大小
            if (!contain_same_file) {
              if (files_total_size > $scope.user_unused_size) {
                Notification.show({
                  title: '上传失败',
                  type: 'danger',
                  msg: 'LANG_FILES_NO_SPACE_MESSAGE',
                  closeable: false
                })
              } else if ($files.length != 0) {
                $rootScope.$broadcast('uploadFiles', $files);
              }
            }
          })
        } else {
          Notification.show({
            title: '上传失败',
            type: 'danger',
            msg: 'LANG_FILES_NO_SPACE_MESSAGE',
            closeable: false
          })
        }
      })
    }

    //文件预览
    $scope.previewFile = function($event, obj) {
      $event.stopPropagation()
      if(!obj.is_preview){//没有权限预览
        return
      }

      var previewFileModal = $modal.open({
        templateUrl: 'src/app/files/preview-file/template.html',
        windowClass: 'preview-file',
        backdrop: 'static',
        controller: 'App.Files.PreviewFileController',
        resolve: {
          obj: function() {
            return obj
          },
          fileVersionPreview: function() {
            return '';
          },
          objList: function() {
            return $scope.objList;
          }
        }
      })
      $rootScope.$broadcast('closeDiscussPannel')

    }

    //添加标签
    $scope.createTag = function(obj) {
      var createTagModal = $modal.open({
        templateUrl: 'src/app/files/create-tag/template.html',
        windowClass: 'create-tag',
        backdrop: false,
        controller: 'App.Files.CreateTagController',
        resolve: {
          obj: function() {
            return obj
          }
        }
      })
    }

    //上传新版本
    $scope.uploadNew = function(checkedObj) {
      if (checkedObj.version_count >= CONFIG.HISTORY_VERSIONS) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: '抱歉：文件的历史版本数不能超过当前套餐的 ' + CONFIG.HISTORY_VERSIONS + ' 个版本限制',
          closeable: false
        })
        return
      }
      var uploadNewModal = $modal.open({
        templateUrl: 'src/app/files/modal-upload.html',
        windowClass: 'modal-upload',
        backdrop: 'static',
        controller: uploadNewModalController,
        resolve: {}
      })

      uploadNewModal.result.then(function(files) {
        var $files = []
        var upload_erro = (CONFIG.UPLOAD_FILE_SIZE == 1024 * 1024 * 1024) ? 'LANG_FILES_NOT_MORE_THAN_1G' : 'LANG_FILES_NOT_MORE_THAN_5G'
        for (var i = 0; i < files.length; i++) {
          if (files[i].size > CONFIG.UPLOAD_FILE_SIZE) { //文件大小不能大于1G
            Notification.show({
              title: '失败',
              type: 'danger',
              msg: upload_erro,
              closeable: false
            })
          } else {
            $files.push(files[i])
          }
        }

        if ($files.length != 0) {
          checkedObj.format_size = Utils.formateSize($files[0].size)
          $rootScope.$broadcast('filesUploadNewFile', $files, checkedObj.file_id)
        }
      })

    }

    var uploadNewModalController = [
      '$scope',
      '$modalInstance',
      '$cookies',
      '$state',
      function(
        $scope,
        $modalInstance,
        $cookies,
        $state
      ) {

        $scope.multiple = false
        $scope.onFileSelect = function($files) {
          $modalInstance.close($files)
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    //设置或者取消同步文件夹
    $scope.setSync = function(checkedObj) {
      var sync = (checkedObj.isSynced == 1) ? 0 : 1
      Folders.setSync({}, {
        sync: sync,
        folder_ids: [checkedObj.folder_id]
      }).$promise.then(function() {
        checkedObj.isSynced = (sync == 0) ? 0 : 1
        checkedObj.isSyncObj = (sync == 0) ? 0 : 1
        var text = (sync == 0) ? '取消同步成功' : '同步成功'
        Notification.show({
          title: '成功',
          type: 'success',
          msg: text,
          closeable: true
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

    //新建笔记
    $scope.createNote = function() {
      Files.createNote({
        folder_id: folderId
      }, {

      }).$promise.then(function(file) {
        $state.go('note', {
          cloudId: $state.params.cloudId,
          fileId: file.file_id,
          folderId: folderId,
          isNew: true
        })
      })

    }

    // 预览笔记
    $scope.previewNote = function(discuss_file) {
      if (discuss_file.is_preview) {
        $state.go('note', {
          cloudId: $state.params.cloudId,
          fileId: discuss_file.file_id,
          folderId: folderId
        })
      }
    }


    //编辑笔记
    $scope.editNote = function(discuss_file) {
      //打开讨论框
      $rootScope.$broadcast('discuss_file', discuss_file)
    }

    //阻止事件冒泡
    $scope.preventPropagation = function($event) {
      $event.stopPropagation()
    }

  }
]).directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
}).directive('focusMe', ['$timeout', '$parse',
  function($timeout, $parse) {
    return {
      scope: {
        'focus': '=focusMe'
      },
      link: function(scope, element) {
        scope.$watch('focus', function(value) {
          if (value === true) {
            $timeout(function() {
              element[0].focus();
            });
          }
        });
        element.bind('blur', function() {
          scope.focus = false
        })
      }
    };
  }
])