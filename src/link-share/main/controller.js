var linkShare = angular.module('App.LinkShare');

linkShare.controller('App.LinkShare.Controller', [
  '$scope',
  '$rootScope',
  'CONFIG',
  'Share',
  'Utils',
  '$modal',
  '$state',
  '$cookieStore',
  'Folders',
  'Notification',
  '$http',
 
  function(
    $scope,
    $rootScope,
    CONFIG,
    Share,
    Utils,
    $modal,
    $state,
    $cookieStore,
    Folders,
    Notification,
    $http
     
  ) { 
    $scope.loading = true
    //链接分享Key
    $scope.key = $state.params.key
    //链接分享所在文件ID
    $scope.folderId = $state.params.folderId || 0
    if ($scope.folderId == 0) {
      $scope.isRoot = true
    }

    if($cookieStore.readCookie('userId')) {
      // 记录访问过该链接
      $http.defaults.headers.common['HTTP_X_OAUTH'] = $cookieStore.readCookie('token');
      Share.addLinkRecord({key: $scope.key});
    }

    //外部链接文件列表(不需要密码时)
    $scope.linkShareList = Share.getLinkShareList({
      key: $scope.key,
      pwd: $cookieStore.get($scope.key + '_pwd'),
      folder_id: $scope.folderId
    })

    $scope.linkShareList.$promise.then(function(linkShareList) {
      $rootScope.$broadcast('global_loading', false);
    }, function(error) {
      $rootScope.$broadcast('global_loading', false);
    })

    //渲染文件列表
    function refreshList(linkShareList) {
      $scope.loading = false; 
      if(linkShareList.length == 0) {
        $scope.folder_empty = true;
      } else {
        $scope.folder_empty = false;
      }      
      if(linkShareList.length == 1 && $scope.isRoot) {
        if(linkShareList[0].isFolder == 1) {
          $state.go('shares', {
            cloudId: $state.params.cloudId,
            key: $state.params.key,
            folderId: linkShareList[0].folder_id
           })
          // window.location.href = '/link.html#/' + $state.params.key + '/' + linkShareList[0].folder_id;
          return;
        } 
        else {
          //对象是否能被预览
          var fileType = Utils.getFileTypeByName(linkShareList[0].file_name || linkShareList[0].folder_name)
          var isPreview = $scope.linkDetail.is_preview ? true : false
          if(isPreview) {
            $state.go('preview', {
              cloudId: $state.params.cloudId,
              key : $scope.key,
              fileId: linkShareList[0].file_id,
              folderId: $scope.folderId
            })
            return;
          } 
        }        
      }
      angular.forEach(linkShareList, function(linkShare) {
        //对象是否被选中
        linkShare.checked = false

        //对象是否是文件夹
        if (linkShare.isFolder == 1) {
          linkShare.folder = true
        } else {
          linkShare.folder = false
        }

        //对象是否能被预览
        var fileType = Utils.getFileTypeByName(linkShare.file_name || linkShare.folder_name)
        linkShare.isPreview = $scope.linkDetail.is_preview ? true : false
        linkShare.fileType = fileType

        //文件图像
        if (linkShare.isFolder == 1) { //文件夹
          if (linkShare.isShared == 1) {
            linkShare.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small_share;
            linkShare.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large_share;
          } else {
            linkShare.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small;
            linkShare.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large;
          }
        } else if (fileType == 'image') { //图片缩略图
          linkShare.smallIcon = CONFIG.API_ROOT + '/share/key?act=preview&key=' + $scope.key + '&pwd=' + $cookieStore.get($scope.key + '_pwd') + '&file_id=' + linkShare.file_id + '&size=48' + '&_=' + new Date().getTime();
        }
        else {
          var ext;
          if (linkShare.isFolder == 1) {
            ext = 'folder';
          } else {
            ext = linkShare.file_name.slice(linkShare.file_name.lastIndexOf('.') + 1);
          }
          var icon = Utils.getIconByExtension(ext);
          linkShare.smallIcon = icon.small;
          linkShare.largeIcon = icon.large;
        }
      })
    }    

    //外部链接文件列表(需要密码时)
    $scope.$on('password', function($event, password) {
      $scope.linkShareList = Share.getLinkShareList({
        key: $scope.key,
        pwd: password
      })
      // $scope.linkShareList.$promise.then(function(linkShareList) {
      //   refreshList(linkShareList)
      // }, function(error) {
      //   var neddPassword = true;
      //   $rootScope.$broadcast('neddPassword', neddPassword);
      //   $rootScope.$broadcast('key', $scope.key);
      // })
      loadLinkDetail();
    })

    var loadLinkDetail = function() {      
      //外部链接详细信息
      $scope.linkDetail = Share.getLinkShareDetail({
        key: $scope.key,
        pwd: $cookieStore.get($scope.key + '_pwd')
      })

      $scope.linkDetail.$promise.then(function(linkDetail) {
        //权限列表
        var is_owner = linkDetail.permission.substring(0, 1) //协同拥有者 or 拥有者1
        var is_delete = linkDetail.permission.substring(1, 2) //删除权限
        var is_edit = linkDetail.permission.substring(2, 3) //编辑权限
        var is_getLink = linkDetail.permission.substring(3, 4) //链接权限
        var is_preview = linkDetail.permission.substring(4, 5) //预览权限
        var is_download = linkDetail.permission.substring(5, 6) //下载权限
        var is_upload = linkDetail.permission.substring(6, 7) //上传权限

        linkDetail.is_owner = (is_owner == '1') ? true : false
        linkDetail.is_delete = (is_delete == '1') ? true : false
        linkDetail.is_edit = (is_edit == '1') ? true : false
        linkDetail.is_getLink = (is_getLink == '1') ? true : false
        linkDetail.is_preview = (is_preview == '1') ? true : false
        linkDetail.is_download = (is_getLink == '1') ? true : false
        linkDetail.is_upload = (is_upload == '1') ? true : false

        $scope.uploadButton = (linkDetail.is_upload) ? true : false
        //仅预览
        linkDetail.preview_only = (linkDetail.permission.substring(4, 7) == '100') ? true : false
        //仅上传
        linkDetail.upload_only = (linkDetail.permission.substring(4, 7) == '001') ? true : false

        $scope.linkShareList.$promise.then(function(linkShareList) {
          refreshList($scope.linkShareList)
        }, function(error) {
          if(error.data.result == 'need password') {
            var neddPassword = true;
            $rootScope.$broadcast('neddPassword', neddPassword);
            $rootScope.$broadcast('key', $scope.key);
          } else {
            Notification.show({
              title: '失败',
              type: 'danger',
              msg: error.data.result,
              closeable: false
            })
          }
        })
      }, function(error) {
        if(error.data.result == 'need password') {
          var neddPassword = true;
          $rootScope.$broadcast('neddPassword', neddPassword);
          $rootScope.$broadcast('key', $scope.key);
        } else {
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: error.data.result,
            closeable: false
          })
        }
        
      })
    }

    loadLinkDetail();

    //点击选择或者取消选中文件
    // $scope.selectRecycle = function($event, linkShare) {
    //   //阻止事件冒泡
    //   $event.stopPropagation()
    //   linkShare.checked = !linkShare.checked
    //   $scope.selectedAll = true
    //   for (var i = 0; i < $scope.linkShareList.length; i++) {
    //     if (!$scope.linkShareList[i].checked) {
    //       $scope.selectedAll = false
    //     }
    //   }
    //   //暂不支持批量下载  与文件夹下载
    //   var i = 0
    //   angular.forEach($scope.linkShareList, function(linkShare) {
    //     if (linkShare.checked) {
    //       i++;
    //     }
    //   })

    //   if (i != 1) {
    //     $scope.dowloadButton = false
    //   } else {
    //     for (var i = 0; i < $scope.linkShareList.length; ++i) {
    //       if ($scope.linkShareList[i].checked == true)
    //         break
    //     }
    //     $scope.checkedObj = $scope.linkShareList[i]
    //     if ($scope.checkedObj.isFolder == 1 || $scope.checkedObj.fileType == 'note') {
    //       $scope.dowloadButton = false
    //     } else {
    //       $scope.dowloadButton = true
    //     }
    //   }
    // }

    //全部选择状态
    $scope.selectedAll = false

    $scope.selectedAllswitch = function() {
      angular.forEach($scope.linkShareList, function(linkShare) {
        linkShare.checked = !$scope.selectedAll
      })
      $scope.dowloadButton = false
    }

    //外部链接文件夹路径
    Folders.getFolderPath({
      folder_id: $scope.folderId,
      key: $scope.key
    }).$promise.then(function(folderPath) {
      $scope.folderPath = folderPath;
    });

    //下载文件
    $scope.downloadFile = function() {
      // for (var i = 0; i < $scope.linkShareList.length; ++i) {
      //   if ($scope.linkShareList[i].checked == true)
      //     break
      // }
      // $scope.checkedObj = $scope.linkShareList[i]
      var hiddenIframeID = 'hiddenDownloader'
      var iframe = $('#' + hiddenIframeID)[0]
      if (iframe == null) {
        iframe = document.createElement('iframe')
        iframe.id = hiddenIframeID
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      }
      if($scope.folderId != 0) {
        iframe.src = CONFIG.API_ROOT + '/share/key?act=download&key=' + $scope.key + '&pwd=' + $cookieStore.get($scope.key + '_pwd') + '&folder_id=' + $scope.folderId;
      } else {
        iframe.src = CONFIG.API_ROOT + '/share/key?act=download&key=' + $scope.key + '&pwd=' + $cookieStore.get($scope.key + '_pwd') + '&file_id=' + $scope.linkShareList[0].file_id;
      }
    }

    //上传文件
    $scope.upload = function() {
      var uploadModal = $modal.open({
        templateUrl: 'src/link-share/main/modal-upload.html',
        windowClass: 'modal-upload',
        backdrop: 'static',
        controller: uploadModalController,
        resolve: {}
      })

      uploadModal.result.then(function(files) {
        var $files = [];
        for (var i = 0; i < files.length; i++) {
          var fileType = Utils.getFileTypeByName(files[i].name)
          if(fileType == 'note'){
            Notification.show({
              title: '失败',
              type: 'danger',
              msg: '不允许上传.note类型文件',
              closeable: false
            })
          }else{
            $files.push(files[i]);
          }
        }
        if($files.length != 0){
          $rootScope.$broadcast('uploadFiles', $files);
        }  
      })
    }

    //上传成功后刷新列表
    $scope.$on('uploadFilesDone', function() {
      $scope.linkShareList = Share.getLinkShareList({
        key: $scope.key,
        pwd: $cookieStore.get($scope.key + '_pwd'),
        folder_id: $scope.folderId
      })
      $scope.linkShareList.$promise.then(function(linkShareList) {
        refreshList(linkShareList)
      })
    })

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
        $scope.onFileSelect = function($files) {
          $modalInstance.close($files)
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    //检查预览的文件大小及类型
    function checkFileValid(obj) {
      var fileSize = obj.file_size;
      var fileType = Utils.getFileTypeByName(obj.file_name);
      if ('office' == fileType) {
        //office文档最大预览为10M
        if (fileSize > 10485760) {
          return false;
        }
      } else if ('pdf' == fileType) {
        //pdf设置最大预览为50M
        if (fileSize > 52428800) {
          return false;
        }
      }
      return true;
    }

    //文件预览
    $scope.previewFile = function(obj) {
      // var validFile = checkFileValid(obj);
      // if (validFile) {
        $state.go('preview', {
          cloudId: $state.params.cloudId,
          key : $scope.key,
          fileId: obj.file_id,
          folderId: $scope.folderId
        })
      // } else {
      //   Notification.show({
      //     title: '失败',
      //     type: 'danger',
      //     msg: '仅仅允许预览10MB以下文件。',
      //     closeable: false
      //   })
      // }
    }

    //MODAL USER LOGIN   

    $scope.open = function (size) {
      if($cookieStore.readCookie('userId')) {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '正在为你保存文件',
          closeable: false
        });
        var fileName = $scope.folderPath.length == 0 ? $scope.linkShareList[0].file_name : $scope.folderPath[$scope.folderPath.length-1].name;
        Share.saveLinkObj({
          key: $scope.key,
          pwd: $cookieStore.get($scope.key + '_pwd')
        }, {
          obj_id: $scope.folderId,
          obj_type: 'folder'
        }).$promise.then(function() {
          Notification.show({
            title: '成功',
            type: 'success',
            msg: '已将“' + fileName + '”保存到你的全携通的所有文件中',
            closeable: false
          });
        }, function(error) {
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: error.data.result,
            closeable: false
          });
        });
      } else {
        var ModalInstanceCtrl = [
          '$scope',
          '$modalInstance',
          '$rootScope',
          'fileName',
          function($scope, $modalInstance, $rootScope, fileName) {
            $scope.file_name = fileName;
            //按回车键登录
            $scope.monitorKeyPress = function($event) {
              if ($event.keyCode === 13) {
                $scope.loginHandler();
              }
            }
            $scope.loginHandler = function() {
              $rootScope.$broadcast("loginDelegate", $scope.userName, $scope.userPassword, $scope.remember, $modalInstance);
            }
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }
        ]
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          windowClass: 'link-share-login',
          controller: ModalInstanceCtrl,
          size: size,  
          resolve: {
            fileName: function() {
              return $scope.folderPath.length == 0 ? $scope.linkShareList[0].file_name : $scope.folderPath[$scope.folderPath.length-1].name;
            }
          }     
        }); 
        modalInstance.result.then(function() {
          $scope.open();
        })
      }      
    };

    //MODAL USER LOGIN END

    //add Link Record
    $scope.$on("addLinkRecord", function (){
      Share.addLinkRecord({key: $scope.key});
    }) 
  }
]);
