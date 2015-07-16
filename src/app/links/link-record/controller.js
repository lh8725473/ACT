angular.module('App.Links.LinkRecordList').controller('App.Links.LinkRecordList.Controller', [
  '$scope',
  'CONFIG',
  'Share',
  'Utils',
  '$modal',
  'Notification',
  'Confirm',
  '$rootScope',
  '$window',
  function(
    $scope,
    CONFIG,
    Share,
    Utils,
    $modal,
    Notification,
    Confirm,
    $rootScope,
    $window
  ) {

    //加载动画
    $scope.loading = true

    //最近访问链接文件列表
    $scope.linkRecordList = Share.linkRecordList()

    $scope.linkRecordList.$promise.then(function(linkRecordList) {
      //回收站是否为空
      $scope.showEmpty = (linkRecordList.length == 0) ? false : true
    })

    $scope.linkRecordList.$promise.then(function(linkRecordList) {
      $scope.loading = false
      angular.forEach(linkRecordList, function(linkRecord) {
        //对象是否被选中
        linkRecord.checked = false

        //对象是否是文件夹
        linkRecord.folder = (linkRecord.isFolder == 1) ? true : false

        //文件图像
        if (linkRecord.isFolder == 1) { //文件夹
          if (linkRecord.isShared == 1) {
            linkRecord.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small_share
            linkRecord.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large_share
          } else {
            linkRecord.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small
            linkRecord.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large
          }
        } else {
          var ext;
          if (linkRecord.isFolder == 1) {
            ext = 'folder';
          } else {
            ext = linkRecord.file_name.slice(linkRecord.file_name.lastIndexOf('.') + 1);
          }
          var icon = Utils.getIconByExtension(ext);
          linkRecord.smallIcon = icon.small;
          linkRecord.largeIcon = icon.large;
        }
      })
    })

    //删除最近访问链接
    $scope.deleteLinkRecord = function(linkRecord) {
      Confirm.show({
        title: 'LANG_LINKS_DELETE_RECORDLINK',
        content: 'LANG_LINKS_DELETE_RECORDLINK_CONFIRM_MESSAGE',
        okButtonContent: 'LANG_LINKS_DELETE_RECORDLINK',
        ok: function($modalInstance) {
          deleteLinkRecord(linkRecord, $modalInstance)
        }
      })
    }

    function deleteLinkRecord(linkRecord, $modalInstance) {
      Share.deleteLinkRecord({
        id: linkRecord.link_id
      }).$promise.then(function() {
        for (var i = 0; i < $scope.linkRecordList.length; ++i) {
          if ($scope.linkRecordList[i].link_id == linkRecord.link_id) {
            $scope.linkRecordList.splice(i, 1)
            break
          }
        }

        Notification.show({
          title: '成功',
          type: 'success',
          msg: 'LANG_FILES_DELETE_RECORDLINK_SUCCESS_MESSAGE',
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

    $scope.openLink = function(linkRecord){
      var path = 'link.html#/' + linkRecord.share_key + '/0'
      $window.open(path);
    }

  }
])