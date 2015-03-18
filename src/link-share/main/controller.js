angular.module('App.LinkShare').controller('App.LinkShare.Controller', [
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
    Notification
  ) {

    //链接分享Key
    $scope.key = $state.params.key
    //链接分享所在文件ID
    $scope.folderId = $state.params.folderId || 0
    if($scope.folderId == 0){
      $scope.isRoot = true
    }

    //外部链接文件列表(不需要密码时)
    $scope.linkShareList = Share.getLinkShareList({
      key : $scope.key,
      pwd : $cookieStore.get('password'),
      folder_id : $scope.folderId
    })

    //渲染文件列表
    function refreshList(linkShareList){
      angular.forEach(linkShareList, function(linkShare){
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
        linkShare.isPreview = (fileType && $scope.linkDetail.is_preview) ? true : false
        linkShare.isNote = (fileType == 'note') ? true : false

        //文件图像
        if (linkShare.isFolder == 1) { //文件夹
          if (linkShare.isShared == 1) {
            linkShare.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small_share;
            linkShare.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large_share;
          } else {
            linkShare.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small;
            linkShare.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large;
          }
        } else {
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
        key : $scope.key,
        pwd : password
      })
      $scope.linkShareList.$promise.then(function(linkShareList) {
        refreshList(linkShareList)
      },function(error) {
        var neddPassword = true;
        $rootScope.$broadcast('neddPassword', neddPassword);
        $rootScope.$broadcast('key', $scope.key);
      })
    })

    //外部链接详细信息
    $scope.linkDetail = Share.getLinkShareDetail({
      key : $scope.key
    })

    $scope.linkDetail.$promise.then(function(linkDetail) {
      //权限列表
      var is_owner = linkDetail.permission.substring(0, 1)  //协同拥有者 or 拥有者1
      var is_delete =  linkDetail.permission.substring(1, 2)  //删除权限
      var is_edit =  linkDetail.permission.substring(2, 3)  //编辑权限
      var is_getLink =  linkDetail.permission.substring(3, 4)  //链接权限
      var is_preview =  linkDetail.permission.substring(4, 5)  //预览权限
      var is_download =  linkDetail.permission.substring(5, 6)  //下载权限
      var is_upload =  linkDetail.permission.substring(6, 7)  //上传权限

      linkDetail.is_owner = (is_owner == '1') ? true : false
      linkDetail.is_delete = (is_delete == '1') ? true : false
      linkDetail.is_edit = (is_edit == '1') ? true : false
      linkDetail.is_getLink = (is_getLink == '1') ? true : false
      linkDetail.is_preview = (is_preview == '1') ? true : false
      linkDetail.is_download = (is_getLink == '1') ? true : false
      linkDetail.is_upload = (is_upload == '1') ? true : false

      if(linkDetail.is_upload){
        $scope.uploadButton = true
      }

      if(linkDetail.comment==''){
        linkDetail.comment = 'Ta很懒什么也没留下'
      }

      $scope.linkShareList.$promise.then(function(linkShareList) {
        refreshList($scope.linkShareList)
      },function(error) {
        var neddPassword = true;
        $rootScope.$broadcast('neddPassword', neddPassword);
        $rootScope.$broadcast('key', $scope.key);
      })
    },function(error) {
      Notification.show({
        title: '失败',
        type: 'danger',
        msg: error.data.result,
        closeable: false
      })
    })

    //点击选择或者取消选中文件
    $scope.selectRecycle = function($event, linkShare){
      //阻止事件冒泡
      $event.stopPropagation()
      linkShare.checked = !linkShare.checked
      $scope.selectedAll = true
      for (var i = 0; i < $scope.linkShareList.length; i++) {
        if(!$scope.linkShareList[i].checked){
          $scope.selectedAll = false
        }
      }
      //暂不支持批量下载  与文件夹下载
      var i = 0
      angular.forEach($scope.linkShareList, function(linkShare){
        if(linkShare.checked){
          i++;
        }
      })

      if(i != 1){
        $scope.dowloadButton = false
      }else{
        for (var i = 0; i < $scope.linkShareList.length; ++i) {
          if ($scope.linkShareList[i].checked == true)
            break
        }
        $scope.checkedObj = $scope.linkShareList[i]
        if($scope.checkedObj.isFolder == 1 ){
          $scope.dowloadButton = false
        }else{
          $scope.dowloadButton = true
        }
       }
    }

    //全部选择状态
    $scope.selectedAll = false

    $scope.selectedAllswitch = function() {
      angular.forEach($scope.linkShareList, function(linkShare) {
        linkShare.checked = !$scope.selectedAll
      })
      $scope.dowloadButton = false
    }

    //外部链接文件夹路径
    $scope.folderPath = Folders.getFolderPath({
      folder_id: $scope.folderId,
      key : $scope.key
    })

    //下载文件
    $scope.downloadFile = function(){
      for (var i = 0; i < $scope.linkShareList.length; ++i) {
        if ($scope.linkShareList[i].checked == true)
          break
      }
      $scope.checkedObj = $scope.linkShareList[i]
      var hiddenIframeID = 'hiddenDownloader'
      var iframe = $('#' + hiddenIframeID)[0]
      if (iframe == null) {
        iframe = document.createElement('iframe')
        iframe.id = hiddenIframeID
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      }
      iframe.src = CONFIG.API_ROOT + '/share/key?act=download&key=' + $scope.key + '&pwd=' + $cookieStore.get('password') +'&file_id=' + $scope.checkedObj.file_id
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

      uploadModal.result.then(function($files) {
        $rootScope.$broadcast('uploadFiles', $files);
      })
    }

    //上传成功后刷新列表
    $scope.$on('uploadFilesDone', function() {
      $scope.linkShareList = Share.getLinkShareList({
        key : $scope.key,
        pwd : $cookieStore.get('password'),
        folder_id : $scope.folderId
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
    function checkFileValid (obj) {
      var fileSize = obj.file_size;
      var fileType = Utils.getFileTypeByName(obj.file_name);
      if ('office' == fileType) {
        //office文档最大预览为10M
        if (fileSize > 10485760) {
          return false;
        }
      }
      else
        if('pdf'==fileType){
          //pdf设置最大预览为50M
          if(fileSize>52428800)
          {
            return false;
          }
        }
      return true;
    }

    //文件预览
    $scope.previewFile = function (obj) {
      var validFile = checkFileValid(obj);
      if (validFile) {
        var previewFileModal = $modal.open({
          templateUrl: 'src/link-share/main/preview-file/template.html',
          windowClass: 'preview-file',
          backdrop: 'static',
          controller: 'App.LinkShare.PreviewFileController',
          resolve: {
            obj: function () {
              return obj
            }
          }
        })
      }else {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: '仅仅允许预览10MB以下文件。',
          closeable: false
        })
      }
    }
  }
])