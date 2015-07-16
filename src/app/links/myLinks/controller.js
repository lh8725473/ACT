angular.module('App.Links.Mylinks').controller('App.Links.Mylinks.Controller', [
  '$scope',
  'CONFIG',
  'Share',
  'Utils',
  '$modal',
  'Notification',
  '$rootScope',
  '$state',
  'Confirm',
  '$window',
  '$cookies',
  function(
    $scope,
    CONFIG,
    Share,
    Utils,
    $modal,
    Notification,
    $rootScope,
    $state,
    Confirm,
    $window,
    $cookies
  ) {

    //加载动画
    $scope.loading = true

    //我的链接文件列表
    $scope.myLinksList = Share.linkList()

    $scope.myLinksList.$promise.then(function(myLinksList) {
      //我的链接是否为空
      $scope.showEmpty = (myLinksList.length == 0) ? false : true
      $scope.loading = false
    })

    $scope.myLinksList.$promise.then(function(myLinksList) {
      $scope.loading = false
      angular.forEach(myLinksList, function(myLink) {
        //对象是否是文件夹
        myLink.folder = (myLink.isFolder == 1) ? true : false

        //链接地址
        var path = ''
        var fileType = Utils.getFileTypeByName(myLink.file_name || myLink.folder_name)
        if('note' == fileType){//note文件
          path = 'index.html#/note/' + myLink.file_id + '?folderId=' + myLink.folder_id
        }else{
          path = 'index.html#/files/' + myLink.folder_id
          if(!myLink.folder){//文件
            path = path + '?file_id=' + myLink.file_id
          }
        }
        myLink.path = path

        //文件图像
        if (myLink.isFolder == 1) { //文件夹
          if (myLink.isShared == 1) {
            myLink.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small_share
            myLink.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large_share
          } else {
            myLink.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small
            myLink.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large
          }  
        } else if (fileType == 'image') { //图片缩略图
          myLink.smallIcon = CONFIG.API_ROOT + '/file/preview/' + myLink.file_id + '?token=' + $cookies.token + '&size=48' + '&_=' + new Date().getTime()
        } else {
          var ext;
          if (myLink.isFolder == 1) {
            ext = 'folder'
          } else {
            ext = myLink.file_name.slice(myLink.file_name.lastIndexOf('.') + 1)
          }
          var icon = Utils.getIconByExtension(ext)
          myLink.smallIcon = icon.small
          myLink.largeIcon = icon.large
        }
      })
    })

    //编辑我的链接
    $scope.editMyLink = function(myLink){
      var is_edit = myLink.permission.substring(2, 3) //编辑权限
      myLink.is_edit = (is_edit == '1') ? true : false
      myLink.has_link = true
      var linkShareModal = $modal.open({
        templateUrl: 'src/app/files/link-share/template.html',
        windowClass: 'link-share',
        backdrop: 'static',
        controller: 'App.Files.LinkShareController',
        resolve: {
          obj: function() {
            return myLink
          }
        }
      })
      linkShareModal.result.then(function(link_id){
        for (var i = 0; i < $scope.myLinksList.length; ++i) {
          if ($scope.myLinksList[i].link_id == link_id) {
            $scope.myLinksList.splice(i, 1)
            break
          }
        }
      });
    }

    //删除我的链接
    $scope.deleteMyLink = function(myLink){
      Confirm.show({
        title: 'LANG_LINKS_DELETE_MYLINK',
        content: 'LANG_LINKS_DELETE_MYLINK_CONFIRM_MESSAGE',
        param: myLink.folder ? myLink.folder_name : myLink.file_name, 
        okButtonContent: 'LANG_LINKS_DELETE_MYLINK',
        ok: function($modalInstance) {
          deleteMyLink(myLink, $modalInstance)
        }
      })
    }

    function deleteMyLink(myLink, $modalInstance){
      Share.deleteLink({
        id: myLink.link_id
      }).$promise.then(function() {
        for (var i = 0; i < $scope.myLinksList.length; ++i) {
          if ($scope.myLinksList[i].link_id == myLink.link_id) {
            $scope.myLinksList.splice(i, 1)
            break
          }
        }

        Notification.show({
          title: '成功',
          type: 'success',
          msg: 'LANG_FILES_DELETE_MYLINK_SUCCESS_MESSAGE',
          param: myLink.folder ? myLink.folder_name : myLink.file_name,
          closeable: true
        })

        $modalInstance.dismiss('cancel')
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
        $modalInstance.dismiss('cancel')
      })
    }

    //点击我的链接打开新窗口
    $scope.openNewWindow = function(myLink){    
      $window.open(myLink.path)
    }

  }
])