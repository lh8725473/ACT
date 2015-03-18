angular.module('App.Files').controller('App.Files.LinkShareController', [
  '$scope',
  '$modalInstance',
  'obj',
  'Share',
  'Notification',
  'Cloud',
  function(
    $scope,
    $modalInstance,
    obj,
    Share,
    Notification,
    Cloud
  ) {
    var users = []
    Cloud.cloudUserList().$promise.then(function(cloudUser) {
      angular.forEach(cloudUser.list.users, function(user) {
        users.push(user)
      })
    })

    $scope.emailSelectOptions = {
      'multiple': true,
      'simple_tags': true,
      'tags': function() {
        return users.map(function(user) {
          return user.email
        })
      }
    }

    //发送链接邮件数组
    $scope.selectedEmails = []

    $scope.today = function() {
      var today = new Date()
      today.setTime(today.getTime() + (7 * 24 * 60 * 60 * 1000))
      $scope.dt = today
    };
    $scope.today()

    $scope.clear = function() {
      $scope.dt = null
    }

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
    }

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date()
    };
    $scope.toggleMin()

    $scope.open = function($event) {
      $event.preventDefault()
      $event.stopPropagation()
      $scope.opened = true
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate']
    $scope.format = $scope.formats[1]

    //链接对象
    $scope.obj = obj

    //是否已有链接
    $scope.has_link = ($scope.obj.link_id != 0) ? true : false

    if($scope.obj.link_id != 0){
      $scope.link_detail = Share.viewLink({
        id : $scope.obj.link_id
      })

      $scope.link_detail.$promise.then(function(link_detail) {
        $scope.code_src = link_detail.code_src
        $scope.link = link_detail.link
//      $scope.linkSharePassword = link_detail.password
        $scope.comment = link_detail.comment
        $scope.set_password = link_detail.set_password
        $scope.pass_placeholder = (link_detail.set_password) ? 'LANG_LINK_OLD_PASSWORD' : 'LANG_LINK_ENTER_PASSWORD'
        $scope.dt = new Date(parseInt(link_detail.expiration)*1000)
        angular.forEach($scope.linkSharePermissionKeyList, function(permissionKey, index) {
          if (permissionKey == link_detail.permission) {
            $scope.linkSharePermissionValue = $scope.linkSharePermissionValueList[index]
          }
        })
      })
    }

    //链接对象类型
    $scope.type = ($scope.obj.folder) ? "folder" : "file"

    //链接分享权限
    $scope.linkSharePermissionValue = "LANG_LINK_ONLY_PREVIEW"
    $scope.linkSharePermissionKey = "0000100"

    //链接分享权限List
    if ($scope.obj.folder) { //文件夹
      $scope.linkSharePermissionValueList = ["LANG_LINK_ONLY_PREVIEW", "LANG_LINK_ONLY_UPLOAD", "LANG_LINK_PREVIEW_AND_DOWNLOAD", "LANG_LINK_PREVIEW_AND_DOWNLOAD_AND_UPLOAD"]
      $scope.linkSharePermissionKeyList = ["0000100", "0000001", "0001110", "0001111"]
    } else { //文件
      $scope.linkSharePermissionValueList = ["LANG_LINK_ONLY_PREVIEW", "LANG_LINK_PREVIEW_AND_DOWNLOAD"]
      $scope.linkSharePermissionKeyList = ["0000100", "0001110"]
    }


    //是否设置访问权限
    $scope.set_password = false

    //访问密码
    $scope.linkSharePassword = ""

    //是否有访问密码
    $scope.pass_placeholder = "LANG_LINK_ENTER_ACCESS_PASSWORD"

    //是否设置访问权限切换
    $scope.changeLinkSharePasswordShow = function() {
      if (!$scope.set_password) {
        $scope.linkSharePassword = ""
      }else{
        $scope.pass_placeholder = 'LANG_LINK_ENTER_ACCESS_PASSWORD'
      }
    }

    //发送链接邮件
    $scope.sendEmail = function() {
      if ($scope.selectedEmails.length == 0) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: "LANG_LINK_RECEIVER_NOT_NULL",
          closeable: false
        })
        return;
      }

      Share.sendEmail({}, {
        obj_name: (obj.isFolder == 1) ? obj.folder_name : obj.file_name,
        link: $scope.link,
        emails: $scope.selectedEmails
      }).$promise.then(function() {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: "LANG_LINK_SEND_MAIL_SUCCESS",
          closeable: true
        })
        $modalInstance.close()
      })
    }

    //链接分享访问密码输入框type
    $scope.linkSharePasswordType = 'password'

    //显示或者隐藏密码
    $scope.changeLinkSharePasswordType = function() {
      if ($scope.linkSharePasswordType == 'password') {
        $scope.linkSharePasswordType = 'text'
      } else {
        $scope.linkSharePasswordType = 'password'
      }
    }

    //选择链接dropdown是否显示
    $scope.permissionOpen = false

    //链接分享选择权限
    $scope.changeLinkSharePermission = function(value) {
      $scope.permissionOpen = !$scope.permissionOpen
      $scope.linkSharePermissionValue = value
      angular.forEach($scope.linkSharePermissionValueList, function(permissionvalue, index) {
        if (permissionvalue == value) {
          $scope.linkSharePermissionKey = $scope.linkSharePermissionKeyList[index]
        }
      })
    }

    //链接说明
    $scope.comment = ""

    //生成链接
    $scope.createLinkShare = function() {
      if($scope.dt == undefined){
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: 'LANG_DATE_EMPTY',
          closeable: false
        })
        return
      }
      $scope.has_link = !$scope.has_link
      Share.getLink({}, {
        comment: $scope.comment,
        expiration: $scope.dt,
        obj_id: ($scope.obj.isFolder == 1) ? $scope.obj.folder_id : $scope.obj.file_id,
        obj_name: $scope.obj.file_name,
        obj_type: $scope.type,
        set_password: $scope.set_password,
        password: $scope.linkSharePassword,
        permission: $scope.linkSharePermissionKey
      }).$promise.then(function(linkShare) {
        $scope.link = linkShare.link
        $scope.code_src = linkShare.code_src
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
      })
    }

    //返回修改
    $scope.backToCreate = function() {
      $scope.has_link = !$scope.has_link
    }

    //复制成功提示
    $scope.showCopySuccess = function() {
      Notification.show({
        title: '成功',
        type: 'success',
        msg: "LANG_LINK_COPY_LINK",
        closeable: true
      })
    }
    
    //复制失败
    $scope.fallback = function(copy) {
      window.prompt('您的浏览器没有安装flash，请按ctrl+c或者cmd+c来复制下面的链接。', copy);
    };

    $scope.cancel = function() {
      $modalInstance.close()
    }
  }
])